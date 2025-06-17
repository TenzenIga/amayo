import { createAction, props } from '@ngrx/store';
import { Comment } from '@shared/interfaces/interfaces';

export enum CommentActions {
  GetComments = '[Comment] Get Comments',
  GetCommentsSuccess = '[Comment] Get Comments Success',
  VoteComment = '[Comment] Vote Comment',
  VoteCommentSuccess = '[Comment] Vote Comment Success',
  CreateComment = '[Comment] Create Comment',
  CreateCommentSuccess = '[Comment] Create Comment Success'
}

export const getComments = createAction(
  CommentActions.GetComments,
  props<{ identifier: string; slug: string }>()
);
export const getCommentsSuccess = createAction(
  CommentActions.GetCommentsSuccess,
  props<{ comments: Comment[] }>()
);

export const voteComment = createAction(
  CommentActions.VoteComment,
  props<{ identifier: string; slug: string; value: number }>()
);

export const voteCommentSuccess = createAction(
  CommentActions.VoteCommentSuccess,
  props<{ comment: Comment }>()
);

export const createComment = createAction(
  CommentActions.CreateComment,
  props<{ identifier: string; slug: string; value: string }>()

)

export const createCommentSuccess = createAction(
  CommentActions.CreateCommentSuccess,
  props<{ comment: Comment }>()

)