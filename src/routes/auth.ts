import { Request, Response, Router } from 'express';
import { isEmpty, validate } from 'class-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../entity/User';
import auth from '../middleware/auth';
import user from '../middleware/user';
import { AppDataSource } from '../data-source';

const mapErrors = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});
};
const userRepository = AppDataSource.getRepository(User);

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    // TODO: validation
    let errors: any = {};

    const emailUser = await userRepository.findOne({ where: { email } });
    const usernameUser = await userRepository.findOne({ where: { username } });

    if (emailUser) errors.email = 'Email is already taken';
    if (usernameUser) errors.username = 'Username is already taken';

    if (Object.keys(errors).length > 0) return res.status(400).json({ errors });

    //TODO: Create user
    const user = new User({ email, username, password });

    errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).json({ errors: mapErrors(errors) });
    }

    await userRepository.save(user);

    //TODO: Return user
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};

    if (isEmpty(username)) errors.username = 'Username must not be empty';
    if (isEmpty(password)) errors.password = 'Password must not be empty';
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = await userRepository.findOne({ where: { username } });

    if (!user) return res.status(404).json({ username: 'User not found' });

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches)
      return res.status(401).json({ password: 'Password is incorrect' });

    const token = jwt.sign({ username }, process.env.JWT_SECRET!);
    return res.json({ token });
  } catch (error) {
    return res.json({ error: 'Something went wrong' });
  }
};

const me = (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

const logout = async (_: Request, res: Response) => {
  return res.status(200).json({ success: true });
};

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', user, auth, me);
router.get('/logout', user, auth, logout);

export default router;
