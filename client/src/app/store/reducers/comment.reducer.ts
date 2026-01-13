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
      addCommentVote(
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
  })),
  on(CommentActions.deleteCommentSuccess, (state, payload) => ({
    ...state,
    comments: deleteCommentFromTree(state.comments, payload.comment.identifier)
  })),
  on(CommentActions.editCommentSuccess, (state, payload) => ({
    ...state,
    comments: updateComment(state.comments, payload.comment)
  }))
);

function addCommentVote(
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
        addCommentVote(c, identifier, userVote, voteScore)
      )
    };
  }
  return comment;
}

function deleteCommentFromTree(
  comments: Comment[],
  identifier: string
): Comment[] {
  return comments
    .filter((comment) => comment.identifier !== identifier)
    .map((comment) => ({
      ...comment,
      children: deleteCommentFromTree(comment.children, identifier)
    }));
}

function updateComment(
  comments: Comment[],
  updatedComment: Comment
): Comment[] {
  return comments.map((comment) => {
    if (comment.identifier === updatedComment.identifier) {
      return { ...comment, ...updatedComment };
    }

    const updatedChildren = comment.children
      ? updateComment(comment.children, updatedComment)
      : comment.children;

    if (updatedChildren !== comment.children) {
      return { ...comment, children: updatedChildren };
    }

    return comment;
  });
}
