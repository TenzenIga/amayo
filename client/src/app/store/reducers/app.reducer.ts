import { ActionReducerMap } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { commentReducer } from './comment.reducer';
import { postReducer } from './post.reducer';
import { subReducer } from './sub.reducer';
import { userReducer } from './user.reducer';

export const appReducers: ActionReducerMap<IAppState, any> = {
  posts: postReducer,
  comments: commentReducer,
  subs: subReducer,
  user: userReducer,
};
