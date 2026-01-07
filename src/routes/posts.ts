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
  const body = req.body.body;

  try {
    const post = await postRepository.findOneOrFail({
      where: { identifier, slug }
    });
    const comment = new Comment({
      body,
      user: res.locals.user,
      post
    });

    await commentRepository.save(comment);
    return res.json(comment);
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

    const comments = await commentRepository.find({
      where: { post: { id: post.id } },
      order: { createdAt: 'DESC' },
      relations: ['votes']
    });

    if (res.locals.user) {
      comments.forEach((c) => c.setUserVote(res.locals.user));
    }

    return res.json(comments);
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

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
