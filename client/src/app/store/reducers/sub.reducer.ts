import { createReducer, on } from '@ngrx/store';
import * as SubActions from '../actions/sub.action';
import { initialSubState } from '../state/sub.state';

export const subReducer = createReducer(
  initialSubState,
  on(SubActions.getSubSuccess, (state, payload) => ({
    ...state,
    sub: payload.sub
  })),
  on(SubActions.getTopSubsSuccess, (state, payload) => ({
    ...state,
    topSubs: payload.topSubs
  })),
  on(SubActions.searchSubsSuccess, (state, payload) => ({
    ...state,
    suggestions: payload.suggestions
  })),
  on(SubActions.searchSubsClear, (state) => ({ ...state, suggestions: [] })),
  on(SubActions.clearSub, (state) => ({ ...state, sub: null })),
  on(SubActions.subscribeToSubSuccess, (state) =>({...state, sub: {...state.sub, subscriptionStatus: true} })),
  on(SubActions.unsubscribeSubSuccess, (state) =>({...state, sub: {...state.sub, subscriptionStatus: false} })),
  on(SubActions.deleteSubSuccess, (state) => ({ ...state, sub: null })),
);
