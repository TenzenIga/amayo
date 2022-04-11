import { Router, Request, Response } from "express";

import auth from "../middleware/auth";
import  Post from "../entity/Post";
import Sub from "../entity/Sub";
import Comment from "../entity/Comment";
import user from "../middleware/user";

const createPost = async (req:Request, res:Response) => {
    const {title, body, sub} = req.body;    
    const user = res.locals.user;

    if(title.trim() === ''){
        return res.status(400).json({title:'Title must not be empty'});
    }
   
    try {
        // find sub
        const subRecord = await Sub.findOneOrFail({name:sub})

        const post = new Post({title, body, user, sub: subRecord});
        await post.save();
        
        return  res.json(post);
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:"Something went wrong"})
        
    }
}

const deletePost = async (req:Request, res:Response) => {    
    const {identifier, slug} = req.params;
    const user = res.locals.user;
    
    try {
        const post = await Post.findOneOrFail({identifier, slug});

        console.log(post);
        
        if(post.username !== user.username){
            return res.status(403).json({error: 'You dont own this post'})
        }
        const response = await Post.delete({identifier, slug})
        
        return  res.json(response)
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:"Something went wrong"})
        
    }
}

const getPosts = async (_:Request, res:Response) => {
    try {
        const posts = await Post.find({
            order: {createdAt:'DESC'},
            relations: ['comments', 'votes', 'sub']
        });
        
        if(res.locals.user){
            posts.forEach(p => p.setUserVote(res.locals.user))
        }

        return res.json(posts);
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Someting went wrong'})
    }
}

const getPost = async (req:Request, res:Response) => {
    const {identifier, slug} = req.params;
     
    try {
        const post = await Post.findOneOrFail(
            {identifier, slug},
            {relations:['sub', 'votes', 'comments']}   
        );

        if(res.locals.user){
            post.setUserVote(res.locals.user)
        }
        
        return res.json(post);
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Post is not found'})
    }
}

const commentOnPost = async(req:Request,res: Response ) =>{
    const {identifier, slug} = req.params;
    const body = req.body.body;

    try {
        const post = await Post.findOneOrFail({identifier, slug});
        const comment = new Comment({
            body,
            user: res.locals.user,
            post
        })

     
        await comment.save();

        return res.json(comment)
    } catch (err) {
        console.log(err);
        return res.status(404).json({error:"Post not found"})
    }
}

const getPostComments = async (req: Request, res: Response) => {
    const {identifier, slug } = req.params;
    try {
        const post = await Post.findOneOrFail({identifier, slug});

        const comments = await Comment.find({
            where: {post},
            order: {createdAt: 'DESC'},
            relations:['votes']
        })

        if(res.locals.user){
            comments.forEach(c => c.setUserVote(res.locals.user))
        }

        return res.json(comments)
    } catch (error) {
        return res.status(500).json({error: 'Something went wrong'})
    }
}

const router = Router()

router.post('/', user, auth, createPost);
router.delete('/:identifier', user, auth, deletePost);
router.get('/', user, getPosts);
router.get('/:identifier/:slug', user, getPost);
router.post('/:identifier/:slug/comments', user, auth, commentOnPost);
router.get('/:identifier/:slug/comments', user, getPostComments);

export default router;