import { createReducer, on } from '@ngrx/store';
import * as SubActions from '../actions/sub.action';
import { initialSubState } from '../state/sub.state';

export const subReducer = createReducer(
  initialSubState,
  // on(SubActions.GetSub, (state)=> ({...state, loading:true}))
  on(SubActions.getSubSuccess, (state, payload) => ({
    ...state,
    sub: payload.sub
  }))
);
