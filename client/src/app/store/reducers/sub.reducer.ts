import { createReducer, on } from '@ngrx/store';
import * as SubActions from '../actions/sub.action';
import { initialSubState } from '../state/sub.state';
import * as PostActions from '../actions/post.action';

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
  on(SubActions.subscribeToSubSuccess, (state, payload) => ({
    ...state,
    sub: { ...state.sub, subscriptionStatus: true },
    subs: state.subs.map((s) => {
      if (s.id === payload.sub.id) {
        return { ...s, subscriptionStatus: true };
      }
      return s;
    })
  })),
  on(SubActions.unsubscribeSubSuccess, (state, payload) => ({
    ...state,
    sub: { ...state.sub, subscriptionStatus: false },
    subs: state.subs.map((s) => {
      if (s.id === payload.sub.id) {
        return { ...s, subscriptionStatus: false };
      }
      return s;
    })
  })),
  on(SubActions.deleteSubSuccess, (state) => ({ ...state, sub: null })),
  on(PostActions.deletePostSuccess, (state, paylaod) => ({
    ...state,
    sub: {
      ...state.sub,
      posts: state.sub.posts.filter(
        (p) => p.identifier !== paylaod.post.identifier
      )
    }
  })),
  on(SubActions.getSubsListSuccess, (state, paylaod) => ({
    ...state,
    subs: paylaod.subs
  }))
);
