import { Request, Response, Router } from 'express';

import Comment from '../entity/Comment';
import Post from '../entity/Post';
import User from '../entity/User';

import user from '../middleware/user';

const getUserInfo = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneOrFail({
      where: { username: req.params.username },
      relations: ['subscriptions']
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getUserSubmissions = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const user = await User.findOneOrFail({
      where: { username: req.params.username }
    });

    const postsCount = await Post.count({ where: { user } });
    const commentsCount = await Comment.count({ where: { user } });

    let posts: Post[] = [];
    let comments: Comment[] = [];

    if (type === 'all' || type === 'post') {
      posts = await Post.find({
        where: { user },
        relations: ['comments', 'votes', 'sub']
      });
    }
    if (type === 'all' || type === 'comment') {
      comments = await Comment.find({
        where: { user },
        relations: ['post', 'post.sub', 'votes']
      });
    }

    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user));
      comments.forEach((c) => c.setUserVote(res.locals.user));
    }
    let submissions: any[] = [];
    posts.forEach((p) => submissions.push({ type: 'Post', ...p.toJSON() }));
    comments.forEach((c) =>
      submissions.push({ type: 'Comment', ...c.toJSON() })
    );

    submissions.sort((a, b) => {
      if (b.createdAt > a.createdAt) return 1;
      if (b.createdAt < a.createdAt) return -1;
      return 0;
    });

    return res.json({
      submissions,
      submissionsCount: postsCount + commentsCount,
      filter: type
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const router = Router();

router.get('/:username', user, getUserInfo);
router.get('/submissions/:username', user, getUserSubmissions);
export default router;
