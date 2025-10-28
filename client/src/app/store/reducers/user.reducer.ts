import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.action';
import { initialUserState } from '../state/user.state';
import * as SubActions from '../actions/sub.action';

export const userReducer = createReducer(
  initialUserState,
  // on(SubActions.GetSub, (state)=> ({...state, loading:true}))
  on(UserActions.getUserInfoSuccess, (state, payload) => ({
    ...state,
    userData: payload.userData
  })),
  on(SubActions.deleteSubSuccess, (state, payload) => {
    return {
      ...state,
      userData: {
        ...state.userData,
        user: {
          ...state.userData.user,
          subscriptions: state.userData.user.subscriptions.filter(
            (sub) => sub.name !== payload.sub.name
          )
        }
      }
    };
  })
);
