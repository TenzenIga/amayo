import { Request, Response, Router } from 'express';
import { AppDataSource } from '../data-source';
import Comment from '../entity/Comment';
import Post from '../entity/Post';
import user from '../middleware/user';
import auth from './auth';

const commentRepository = AppDataSource.getRepository(Comment);
const postRepository = AppDataSource.getRepository(Post);

const commentOnPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const { body, parentId } = req.body;

  try {
    const post = await postRepository.findOneOrFail({
      where: { identifier, slug }
    });

    const commentData: Partial<Comment> = {
      body,
      user: res.locals.user,
      post
    };

    if (parentId) {
      const parentIdNum = parseInt(parentId, 10);

      if (isNaN(parentIdNum)) {
        return res.status(400).json({
          error: 'Invalid parentId format'
        });
      }
      const parentComment = await commentRepository.findOne({
        where: {
          id: parentId,
          post: { id: post.id }
        }
      });
      if (!parentComment) {
        return res.status(400).json({
          error: 'Parent comment not found'
        });
      }
      if (parentComment.depth >= 10) {
        return res.status(400).json({
          error: 'Maximum nesting depth reached (10 levels)'
        });
      }
      commentData.parent = parentComment;
    }
    const comment = new Comment(commentData);
    await commentRepository.save(comment);
    const savedComment = await commentRepository.findOne({
      where: { id: comment.id },
      relations: ['user', 'parent', 'parent.user']
    });
    return res.json({
      ...savedComment,
      path: savedComment?.pathStringArray || [], // Возвращаем как массив строк
      depth: savedComment?.depth || 0
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: 'Post not found' });
  }
};

const getPostComments = async (req: Request, res: Response) => {
  //post :identifier
  const { identifier } = req.params;
  try {
    const post = await postRepository.findOneOrFail({
      where: { identifier: identifier }
    });
    const dataSource = AppDataSource;
    const comments = await dataSource.query(
      `
      WITH RECURSIVE comment_tree AS (
        SELECT 
          c.id,
          c.identifier,
          c.body,
          c."parentId",
          c.username,
          c."createdAt",
          c."updatedAt",
          c.depth,
          COALESCE(NULLIF(c.path, ''), '') as path,
          1 as level
        FROM comments c
        WHERE c."postId" = $1 AND c."parentId" IS NULL
        
        UNION ALL
        
        SELECT 
          c.id,
          c.identifier,
          c.body,
          c."parentId",
          c.username,
          c."createdAt",
          c."updatedAt",
          c.depth,
          COALESCE(NULLIF(c.path, ''), '') as path,
          ct.level + 1 as level
        FROM comments c
        INNER JOIN comment_tree ct ON c."parentId" = ct.id
        WHERE c."postId" = $1 AND ct.level < 2
      )
      SELECT 
        ct.*,
        u.email as "userEmail",
        COALESCE(
          (
            SELECT jsonb_agg(
              jsonb_build_object(
                'value', v.value,
                'username', v.username
              )
            )
            FROM votes v
            WHERE v."commentId" = ct.id
          ),
          '[]'::jsonb
        ) as votes,
        COALESCE((
          SELECT COUNT(*) 
          FROM votes v 
          WHERE v."commentId" = ct.id AND v.value = 1
        ), 0) as upvotes,
        COALESCE((
          SELECT COUNT(*) 
          FROM votes v 
          WHERE v."commentId" = ct.id AND v.value = -1
        ), 0) as downvotes,
        COALESCE((
          SELECT v.value
          FROM votes v
          WHERE v."commentId" = ct.id AND v.username = $2
          LIMIT 1
        ), 0) as "userVote",
        CASE 
        WHEN $2 IS NOT NULL AND ct.username = $2 THEN true
        ELSE false
      END as "isCommentOwner"
      FROM comment_tree ct
      LEFT JOIN users u ON ct.username = u.username
      ORDER BY 
        ct.depth ASC,
        CASE 
          WHEN ct.path = '' THEN ct.id::text 
          ELSE ct.path 
        END ASC,
        ct."createdAt" ASC;
    `,
      [post.id, res.locals.user?.username || '']
    );
    const commentTree = buildCommentTree(comments);

    return res.json(commentTree);
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
const deleteComment = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const user = res.locals.user;
  try {
    const comment = await commentRepository.findOneOrFail({
      where: { identifier }
    });
    if (comment.username !== user.username) {
      return res.status(403).json({ error: 'You dont own this comment' });
    }

    await commentRepository.save(comment);

    return res.json(comment);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const updateComment = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const { body } = req.body;

  const user = res.locals.user;
  try {
    const comment = await commentRepository.findOneOrFail({
      where: { identifier }
    });

    if (comment.username !== user.username) {
      return res.status(403).json({ error: 'You dont own this comment' });
    }
    comment.body = body;

    await commentRepository.save(comment);

    return res.json(comment);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const router = Router();

router.get('/:identifier', user, getPostComments);
router.post('/:identifier', user, auth, commentOnPost);
router.delete('/:identifier', user, auth, deleteComment);
router.put('/:identifier', user, auth, updateComment);

function buildCommentTree(flatComments: any[]): any[] {
  const commentMap = new Map<number, any>();
  const rootComments: any[] = [];

  // Инициализируем узлы
  flatComments.forEach((comment) => {
    comment.voteScore = (comment.upvotes || 0) - (comment.downvotes || 0);

    commentMap.set(comment.id, {
      ...comment,
      children: []
    });
  });

  // Строим иерархию
  flatComments.forEach((comment) => {
    if (comment.parentId && commentMap.has(comment.parentId)) {
      const parent = commentMap.get(comment.parentId);
      parent.children.push(commentMap.get(comment.id));
    } else {
      rootComments.push(commentMap.get(comment.id));
    }
  });

  return rootComments;
}

export default router;
