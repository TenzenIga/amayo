import { initialCommentState, IPostCommentState } from "./comment.state";
import { initialPostState, IPostState } from "./post.state";
import { initialSubState, ISubState } from "./sub.state";

export interface IAppState {
    posts: IPostState;
    subs: ISubState;
    comments: IPostCommentState
}   

