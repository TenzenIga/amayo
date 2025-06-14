import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.action';
import { initialUserState } from '../state/user.state';

export const userReducer = createReducer(
  initialUserState,
  // on(SubActions.GetSub, (state)=> ({...state, loading:true}))
  on(UserActions.getUserInfoSuccess, (state, payload) => ({
    ...state,
    user: payload.user
  })),

);
