import { Action, createReducer, on } from '@ngrx/store';

import * as CommentActions from '../actions/comment.action';
import { initialCommentState } from '../state/comment.state';

export const commentReducer = createReducer(
  initialCommentState,
  on(CommentActions.getComments, (state) => ({ ...state })),
  on(CommentActions.getCommentsSuccess, (state, payload) => ({
    ...state,
    comments: payload.comments
  })),
  on(CommentActions.voteCommentSuccess, (state, payload) => ({
    ...state,
    comments: state.comments.map((c) =>
      c.identifier === payload.comment.identifier ? payload.comment : c
    )
  }))
);
