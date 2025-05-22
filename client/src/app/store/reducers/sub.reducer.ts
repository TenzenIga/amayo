import { createReducer, on } from '@ngrx/store';
import * as SubActions from '../actions/sub.action';
import { initialSubState } from '../state/sub.state';

export const subReducer = createReducer(
  initialSubState,
  // on(SubActions.GetSub, (state)=> ({...state, loading:true}))
  on(SubActions.getSubSuccess, (state, payload) => ({
    ...state,
    sub: payload.sub
  })),
  // on(SubActions.subscribeToSubSuccess, (state, payload) => ({
  //   ...state,
  //   subs: state.subs.map(s => s.id === payload.sub.id ? )
  // })),
  on(SubActions.getTopSubsSuccess, (state, payload) => ({
    ...state,
    topSubs: payload.topSubs
  })),
  on(SubActions.searchSubsSuccess, (state, payload) => ({
    ...state,
    suggestions: payload.suggestions
  })),
  on(SubActions.searchSubsClear, (state) => ({ ...state, suggestions: [] })),
  on(SubActions.clearSub, (state) => ({ ...state, sub: null }))
);
