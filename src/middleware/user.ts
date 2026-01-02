import { NextFunction, Request, Response } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';

import User from '../entity/User';
import { AppDataSource } from '../data-source';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      return next();
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next();
    }
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });

    res.locals.user = user;

    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: err.message });
  }
};
