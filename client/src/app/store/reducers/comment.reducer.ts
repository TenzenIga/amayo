import { Action, createReducer, on } from '@ngrx/store';

import * as CommentActions from '../actions/comment.action';
import { initialCommentState } from '../state/comment.state';
import { Comment } from '@shared/interfaces/interfaces';

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
      updateComment(
        c,
        payload.comment.identifier,
        payload.comment.userVote,
        payload.comment.voteScore
      )
    )
  })),
  on(CommentActions.createCommentSuccess, (state, payload) => ({
    ...state,
    comments: [...state.comments, payload.comment]
  })),
  on(CommentActions.replyCommentSuccess, (state, payload) => ({
    ...state,
    comments: state.comments.map((c) => {
      if (c.id === payload.comment.parentId) {
        return { ...c, children: [...c.children, payload.comment] };
      }
      return c;
    })
  }))
);

function updateComment(
  comment: Comment,
  identifier: string,
  userVote: number,
  voteScore: number
) {
  if (comment.identifier === identifier) {
    return { ...comment, userVote, voteScore };
  }
  if (comment.children.length > 0) {
    return {
      ...comment,
      children: comment.children.map((c) =>
        updateComment(c, identifier, userVote, voteScore)
      )
    };
  }
  return comment;
}
