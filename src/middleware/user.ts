import { NextFunction ,Request, Response } from "express-serve-static-core";
import jwt from "jsonwebtoken";

import  User  from "../entity/User";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.headers.authorization){
            return next()
        }
        
        const token = req.headers.authorization.split(' ')[1];
        if(!token){ 
            return next()
        }
        const { username }:any = jwt.verify(token, process.env.JWT_SECRET!);

        const user = await User.findOne({username});
        
        res.locals.user = user;

        return next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: err.message});
    }
}