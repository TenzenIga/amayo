import { createAction, props } from '@ngrx/store';
import { Comment } from '@shared/interfaces/interfaces';

export enum CommentActions {
  GetComments = '[Comment] Get Comments',
  GetCommentsSuccess = '[Comment] Get Comments Success',
  VoteComment = '[Comment] Vote Comment',
  VoteCommentSuccess = '[Comment] Vote Comment Success',
  CreateComment = '[Comment] Create Comment',
  CreateCommentSuccess = '[Comment] Create Comment Success',
  ReplyComment = '[Comment] Reply Comment',
  ReplyCommentSuccess = '[Comment] Reply Comment Success',
  DeleteComment = '[Comment] Delete Comment',
  DeleteCommentSuccess = '[Comment] Delete Comment Success'
}

export const getComments = createAction(
  CommentActions.GetComments,
  props<{ identifier: string }>()
);
export const getCommentsSuccess = createAction(
  CommentActions.GetCommentsSuccess,
  props<{ comments: Comment[] }>()
);

export const voteComment = createAction(
  CommentActions.VoteComment,
  props<{ identifier: string; value: number }>()
);

export const voteCommentSuccess = createAction(
  CommentActions.VoteCommentSuccess,
  props<{ comment: Comment }>()
);

export const createComment = createAction(
  CommentActions.CreateComment,
  props<{ identifier: string; value: string }>()
);

export const createCommentSuccess = createAction(
  CommentActions.CreateCommentSuccess,
  props<{ comment: Comment }>()
);
export const replyComment = createAction(
  CommentActions.ReplyComment,
  props<{
    identifier: string;
    value: string;
    commentId: number;
  }>()
);

export const replyCommentSuccess = createAction(
  CommentActions.ReplyCommentSuccess,
  props<{ comment: Comment }>()
);
export const deleteComment = createAction(
  CommentActions.DeleteComment,
  props<{ identifier: string }>()
);
export const deleteCommentSuccess = createAction(
  CommentActions.DeleteCommentSuccess,
  props<{ comment: Comment }>()
);
