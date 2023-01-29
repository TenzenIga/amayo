import { ActionReducerMap } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { commentReducer } from './comment.reducer';
import { postReducer } from './post.reducer';
import { subReducer } from './sub.reducer';

export const appReducers: ActionReducerMap<IAppState, any> = {
  posts: postReducer,
  comments: commentReducer,
  subs: subReducer
};
