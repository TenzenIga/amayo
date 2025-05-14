import { Router, Request, Response, NextFunction } from 'express';
import { isEmpty } from 'class-validator';
import { getRepository } from 'typeorm';
import fs from 'fs';

import auth from '../middleware/auth';
import User from '../entity/User';
import Sub from '../entity/Sub';
import user from '../middleware/user';
import Post from '../entity/Post';
import { upload, validateSubName } from '../utils/helpers';

const createSub = async (req: Request, res: Response) => {
  const { name } = req.body;

  const user: User = res.locals.user;

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = 'Name must not be empty';

    const sub = await getRepository(Sub)
      .createQueryBuilder('sub')
      .where('lower(sub.name) = :name', { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = 'Sub exists already';

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    const sub = new Sub({ name, user, subscribers: [user] });
    await sub.save();

    return res.json(sub);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const checkIfSubExist = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!validateSubName(name)) {
    return res.json({
      fieldError:
        'Название должно быть в пределах 3-21 символов, и может содержать буквы, цифры и нижнее подчеркивание.'
    });
  }
  try {
    const sub = await getRepository(Sub)
      .createQueryBuilder('sub')
      .where('lower(sub.name) = :name', { name: name.toLowerCase() })
      .getOne();
    if (sub) {
      return res.json({ fieldError: `Сообщество r/${name} уже существует` });
    }
    return res.json({ fieldError: null });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getSub = async (req: Request, res: Response) => {
  const name = req.params.name;

  try {
    const sub = await Sub.findOneOrFail(
      { name },
      {
        relations: ['subscribers']
      }
    );
    const posts = await Post.find({
      where: { sub },
      order: { createdAt: 'DESC' },
      relations: ['comments', 'votes']
    });
    sub.posts = posts;
    if (res.locals.user) {
      sub.posts.forEach((p) => p.setUserVote(res.locals.user));
      sub.setStatus(res.locals.user);
    }

    return res.json(sub);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const subOwner = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;
  try {
    const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });

    if (sub.username !== user.username) {
      return res.status(403).json({ error: 'You dont own this sub' });
    }
    res.locals.sub = sub;
    return next();
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};



const uploadSubImage = async (req: Request, res: Response) => {
  const sub: Sub = res.locals.sub;
  try {
    const type = req.body.type;
    if (type !== 'image' && type !== 'banner') {
      fs.unlink(req.file.path, (err) => {
        if (err) console.log(err);
      });
      return res.status(400).json({ error: 'Invalid type' });
    }

    let oldFile = '';
    if (type === 'image') {
      oldFile = sub.imageUrn || '';
      sub.imageUrn = req.file.filename;
    } else if (type === 'banner') {
      oldFile = sub.bannerUrn || '';
      sub.bannerUrn = req.file.filename;
    }
    await sub.save();

    if (oldFile !== '') {
      fs.unlink(`public/images/${oldFile}`, (err) => {
        if (err) console.log(err);
      });
    }
    return res.json(sub);
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const searchSubs = async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    if (isEmpty(name))
      return res.status(400).json({ error: 'Name must not be empty' });

    const subs = await getRepository(Sub)
      .createQueryBuilder()
      .where('LOWER(name) LIKE :name', {
        name: `${name.toLocaleLowerCase().trim()}%`
      })
      .limit(5)
      .getMany();

    return res.json(subs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const router = Router();

router.post('/validateSub', user, auth, checkIfSubExist);
router.post('/', user, auth, createSub);
router.get('/:name', user, getSub);
router.get('/search/:name', searchSubs);
router.post(
  '/:name/image',
  user,
  auth,
  subOwner,
  upload.single('file'),
  uploadSubImage
);

export default router;
