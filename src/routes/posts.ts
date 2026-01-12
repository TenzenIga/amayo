import { Router, Request, Response } from 'express';

import auth from '../middleware/auth';
import Post from '../entity/Post';
import Sub from '../entity/Sub';
import Comment from '../entity/Comment';
import user from '../middleware/user';
import { upload } from '../utils/helpers';
import fs from 'fs';
import { AppDataSource } from '../data-source';

interface PostExtended extends Post {
  subscriptionStatus?: boolean;
  subImageUrl?: string;
}
const commentRepository = AppDataSource.getRepository(Comment);
const subRepository = AppDataSource.getRepository(Sub);
const postRepository = AppDataSource.getRepository(Post);

const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;
  const user = res.locals.user;

  if (title.trim() === '') {
    return res.status(400).json({ title: 'Title must not be empty' });
  }

  try {
    // find sub
    const subRecord = await subRepository.findOneOrFail({
      where: { name: sub }
    });

    const post = new Post({ title, body, user, sub: subRecord });
    if (req.file) {
      post.postImage = req.file.filename;
    }
    // await post.save();
    await postRepository.save(post);
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const deletePost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const user = res.locals.user;

  try {
    const post = await postRepository.findOneOrFail({
      where: { identifier, slug }
    });

    if (post.username !== user.username) {
      return res.status(403).json({ error: 'You dont own this post' });
    }
    // Delete associated images if they exist
    if (post.postImage) {
      fs.unlink(`public/images/${post.postImage}`, (err) => {
        if (err) console.log('Error deleting image:', err);
      });
    }
    await postRepository.delete({ identifier, slug });
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getFeed = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    let totalPosts = 0;

    let posts: PostExtended[] = [];
    if (res.locals.user) {
      const userId = res.locals.user.id;
      [posts, totalPosts] = await postRepository
        .createQueryBuilder('post')
        .innerJoin('post.sub', 'sub')
        .innerJoin('sub.subscribers', 'subscriber', 'subscriber.id = :userId', {
          userId: userId
        })
        .leftJoinAndSelect('post.comments', 'comments')
        .leftJoinAndSelect('post.votes', 'votes')
        .orderBy('post.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      // если у пользователя нет подписок, показываем вместо ленты все посты
      if (totalPosts === 0) {
        totalPosts = await postRepository.count();
        posts = await postRepository.find({
          order: { createdAt: 'DESC' },
          relations: ['comments', 'votes'],
          skip: skip,
          take: limit
        });
      }
      await Promise.all(
        posts.map(async (p) => {
          let sub = await subRepository.findOneOrFail({
            where: { name: p.subName },
            relations: ['subscribers']
          });
          p.setUserVote(res.locals.user);
          p.setOwner(res.locals.user);
          sub.setStatus(res.locals.user);
          p.subscriptionStatus = sub.subscriptionStatus;
          p.subImageUrl = sub.imageUrl;
        })
      );
    } else {
      totalPosts = await postRepository.count();
      posts = await postRepository.find({
        order: { createdAt: 'DESC' },
        relations: ['comments', 'votes'],
        skip: skip,
        take: limit
      });
      await Promise.all(
        posts.map(async (p) => {
          let sub = await subRepository.findOneOrFail({
            where: { name: p.subName },

            relations: ['subscribers']
          });
          p.subscriptionStatus = sub.subscriptionStatus;
          p.subImageUrl = sub.imageUrl;
        })
      );
    }

    return res.json({
      posts,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalCount: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        hasNext: page < Math.ceil(totalPosts / limit),
        hasPrevious: page > 1
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Someting went wrong' });
  }
};

const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const totalPosts = await postRepository.count();

    const posts: PostExtended[] = await postRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['comments', 'votes'],
      skip: skip,
      take: limit
    });
    await Promise.all(
      posts.map(async (p) => {
        let sub = await subRepository.findOneOrFail({
          where: { name: p.subName },

          relations: ['subscribers']
        });
        if (res.locals.user) {
          p.setUserVote(res.locals.user);
          p.setOwner(res.locals.user);
          sub.setStatus(res.locals.user);
        }
        p.subscriptionStatus = sub.subscriptionStatus;
        p.subImageUrl = sub.imageUrl;
      })
    );

    return res.json({
      posts,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalCount: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        hasNext: page < Math.ceil(totalPosts / limit),
        hasPrevious: page > 1
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Someting went wrong' });
  }
};
const getPostsBySub = async (req: Request, res: Response) => {
  const name = req.params.name;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const totalPosts = await postRepository.count();
  try {
    const posts = await postRepository.find({
      where: { sub: { name } },
      order: { createdAt: 'DESC' },
      relations: ['comments', 'votes'],
      skip: skip,
      take: limit
    });

    if (res.locals.user) {
      posts.forEach((p) => {
        p.setUserVote(res.locals.user);
        p.setOwner(res.locals.user);
      });
    }

    return res.json({
      posts,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalCount: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        hasNext: page < Math.ceil(totalPosts / limit),
        hasPrevious: page > 1
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getPopularPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const totalPosts = await postRepository.count();

    const posts: PostExtended[] = await postRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['comments', 'votes'],
      skip: skip,
      take: limit
    });
    await Promise.all(
      posts.map(async (p) => {
        let sub = await subRepository.findOneOrFail({
          where: { name: p.subName },
          relations: ['subscribers']
        });
        if (res.locals.user) {
          p.setUserVote(res.locals.user);
          p.setOwner(res.locals.user);
          sub.setStatus(res.locals.user);
        }
        p.subscriptionStatus = sub.subscriptionStatus;
        p.subImageUrl = sub.imageUrl;
      })
    );
    posts.sort((a, b) => {
      // Сначала по голосам
      if (b.voteScore !== a.voteScore) {
        return b.voteScore - a.voteScore;
      }
      // Затем по комментариям
      if (b.commentCount !== a.commentCount) {
        return b.commentCount - a.commentCount;
      }
      // Затем по дате
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    const sortedPosts = posts.slice(skip, skip + limit);

    return res.json({
      posts: sortedPosts,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalCount: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        hasNext: page < Math.ceil(totalPosts / limit),
        hasPrevious: page > 1
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Someting went wrong' });
  }
};
const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;

  try {
    const post = await postRepository.findOneOrFail({
      where: { identifier, slug },
      relations: ['sub', 'votes', 'comments']
    });

    if (res.locals.user) {
      post.setUserVote(res.locals.user);
      post.setOwner(res.locals.user);
    }

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Post is not found' });
  }
};

const updatePost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const { title, body, isImageDeleted } = req.body;

  const user = res.locals.user;

  try {
    const post = await postRepository.findOneOrFail({
      where: { identifier, slug }
    });

    if (post.username !== user.username) {
      return res.status(403).json({ error: 'You dont own this post' });
    }
    if (req.file) {
      fs.unlink(`public/images/${post.postImage}`, (err) => {
        if (err) console.log('Error deleting image:', err);
      });
      post.postImage = req.file.filename;
    }
    if (isImageDeleted === 'true') {
      fs.unlink(`public/images/${post.postImage}`, (err) => {
        if (err) console.log('Error deleting banner:', err);
      });
      post.postImage = null;
    }
    if (title !== undefined) post.title = title;
    if (body !== undefined) post.body = body;

    await postRepository.save(post);
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

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
  const { identifier, slug } = req.params;
  try {
    const post = await postRepository.findOneOrFail({
      where: { identifier, slug }
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
        ), 0) as "userVote"
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
const router = Router();

router.post('/', user, auth, upload.single('file'), createPost);
router.get('/', user, getFeed);
router.get('/all', user, getPosts);
router.get('/popular', user, getPopularPosts);
router.get('/:name', user, getPostsBySub);
router.delete('/:identifier/:slug', user, auth, deletePost);
router.get('/:identifier/:slug', user, getPost);
router.post('/:identifier/:slug/comments', user, auth, commentOnPost);
router.get('/:identifier/:slug/comments', user, getPostComments);
router.put('/:identifier/:slug', user, auth, upload.single('file'), updatePost);
export default router;
