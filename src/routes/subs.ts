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
  const { name, description } = req.body;

  const user: User = res.locals.user;

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = 'Name must not be empty';
    
    // Validate description length
    if (description && description.length > 500) {
      errors.description = 'Description must not exceed 500 characters';
    }
    
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
    const sub = new Sub({ name, user, subscribers: [user], description });
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    if(files.bannerUrn) {
      sub.bannerUrn = files.bannerUrn[0].filename;
    }
    if(files.imageUrn) {
      sub.imageUrn = files.imageUrn[0].filename;
    }
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

const updateSub = async (req: Request, res: Response) => {
  const { title, description, rules } = req.body;
  const sub: Sub = res.locals.sub;

  try {
    let errors: any = {};
    
    // Validate description length
    if (description && description.length > 500) {
      errors.description = 'Description must not exceed 500 characters';
    }
    
    // Validate title length
    if (title && title.length > 100) {
      errors.title = 'Title must not exceed 100 characters';
    }
    
    // Validate rules length
    if (rules && rules.length > 1000) {
      errors.rules = 'Rules must not exceed 1000 characters';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // Update sub fields
    if (title !== undefined) sub.title = title;
    if (description !== undefined) sub.description = description;
    if (rules !== undefined) sub.rules = rules;

    await sub.save();

    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const deleteSub = async (_req: Request, res: Response) => {
  const sub: Sub = res.locals.sub;

  try {
    // Delete associated images if they exist
    if (sub.imageUrn) {
      fs.unlink(`public/images/${sub.imageUrn}`, (err) => {
        if (err) console.log('Error deleting image:', err);
      });
    }
    
    if (sub.bannerUrn) {
      fs.unlink(`public/images/${sub.bannerUrn}`, (err) => {
        if (err) console.log('Error deleting banner:', err);
      });
    }

    // Delete the sub (this will cascade delete related posts and comments due to foreign key constraints)
    await sub.remove();

    return res.json({ message: 'Sub deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const router = Router();

router.post('/validate-sub', user, auth, checkIfSubExist);
router.post('/',
    user,
    auth, 
    upload.fields([
      { name: 'bannerUrn', maxCount: 1 },
      { name: 'imageUrn', maxCount: 1 }
    ]),
    createSub);
router.get('/:name', user, getSub);
router.get('/search/:name', searchSubs);
router.put('/:name', user, auth, subOwner, updateSub);
router.delete('/:name', user, auth, subOwner, deleteSub);
router.post(
  '/:name/image',
  user,
  auth,
  subOwner,
  upload.single('file'),
  uploadSubImage
);

export default router;
