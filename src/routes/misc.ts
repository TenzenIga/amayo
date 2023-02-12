import { Router, Request, Response } from 'express';

import User from '../entity/User';
import auth from '../middleware/auth';
import Post from '../entity/Post';
import Vote from '../entity/Vote';
import Comment from '../entity/Comment';
import user from '../middleware/user';
import { getConnection } from 'typeorm';
import Sub from '../entity/Sub';

const subscribeToSub = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const sub = await Sub.findOneOrFail(
      { name },
      { relations: ['subscribers'] }
    );
    const user: User = res.locals.user;

    sub.subscribers.push(user);
    await sub.save();
    return res.json(sub);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const voteOnPost = async (req: Request, res: Response) => {
  const { identifier, slug, value } = req.body;

  //Validate value
  if (![-1, 0, 1].includes(value)) {
    return res.status(400).json({ value: 'Value must be -1, 0 or 1' });
  }

  try {
    const user: User = res.locals.user;
    let post = await Post.findOneOrFail({ identifier, slug });
    let vote: Vote | undefined;

    vote = await Vote.findOne({ user, post });

    if (!vote && value === 0) {
      //if no vote and value = 0 return error
      return res.status(404).json({ error: 'Vote not found' });
    } else if (!vote) {
      vote = new Vote({ user, value });
      vote.post = post;
      await vote.save();
    } else if (value === 0) {
      // if vote exists and value = 0 remove vote from DB
      await vote.remove();
    } else if (vote.value !== value) {
      //If  vote  and value has changed, update vote
      vote.value = value;
      await vote.save();
    }

    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ['comments', 'comments.votes', 'sub', 'votes'] }
    );

    post.setUserVote(user);
    post.comments.forEach((c) => c.setUserVote(user));

    return res.json(post);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const voteOnComment = async (req: Request, res: Response) => {
  const { identifier, value } = req.body;
  //Validate value
  if (![-1, 0, 1].includes(value)) {
    return res.status(400).json({ value: 'Value must be -1, 0 or 1' });
  }
  try {
    const user: User = res.locals.user;
    let vote: Vote | undefined;
    let comment: Comment | undefined;
    comment = await Comment.findOneOrFail({ identifier });
    vote = await Vote.findOne({ user, comment });

    if (!vote && value === 0) {
      //if no vote and value = 0 return error
      return res.status(404).json({ error: 'Vote not found' });
    } else if (!vote) {
      vote = new Vote({ user, value });
      vote.comment = comment;
      await vote.save();
    } else if (value === 0) {
      // if vote exists and value = 0 remove vote from DB
      await vote.remove();
    } else if (vote.value !== value) {
      //If  vote  and value has changed, update vote
      vote.value = value;
      await vote.save();
    }
    comment = await Comment.findOneOrFail(
      { identifier },
      { relations: ['votes'] }
    );

    comment.setUserVote(user);

    return res.json(comment);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const topSubs = async (_: Request, res: Response) => {
  try {
    /**
     * SELECT s.title, s.name,
     * COALESCE('http://localhost:5000/images/' || s."imageUrn" , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y') as imageUrl,
     * count(p.id) as "postCount"
     * FROM subs s
     * LEFT JOIN posts p ON s.name = p."subName"
     * GROUP BY s.title, s.name, imageUrl
     * ORDER BY "postCount" DESC
     * LIMIT 5;
     */
    const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn" , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`;
    const subs = await getConnection()
      .createQueryBuilder()
      .select(
        `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
      )
      .from(Sub, 's')
      .leftJoin(Post, 'p', `s.name = p."subName"`)
      .groupBy('s.title, s.name, "imageUrl"')
      .orderBy(`"postCount"`, 'DESC')
      .limit(10)
      .execute();

    return res.json(subs);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const router = Router();

router.post('/subscribe', user, auth, subscribeToSub);
router.post('/vote-post', user, auth, voteOnPost);
router.post('/vote-comment', user, auth, voteOnComment);
router.get('/top-subs', topSubs);
export default router;
