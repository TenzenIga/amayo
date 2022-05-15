import { IPostCommentState } from "./comment.state";
import { IPostState } from "./post.state";
import { ISubState } from "./sub.state";

export interface IAppState {
    posts: IPostState;
    subs: ISubState;
    comments: IPostCommentState;
}   
