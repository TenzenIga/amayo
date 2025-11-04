import { RouterState } from '@ngrx/router-store';
import { IPostCommentState } from './comment.state';
import { IPostState } from './post.state';
import { ISubState } from './sub.state';
import { IUserState } from './user.state';

export interface IAppState {
  posts: IPostState;
  subs: ISubState;
  comments: IPostCommentState;
  user: IUserState;
  router: RouterState;
}
