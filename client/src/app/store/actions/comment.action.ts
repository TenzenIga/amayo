import { createAction, props } from "@ngrx/store";
import { Comment } from '@shared/interfaces/interfaces';

export enum CommentActions {
    GetComments = '[Comment] Get Comments',
    GetCommentsSuccess = '[Comment] Get Comments Success',
};

export const getComments = createAction(
    CommentActions.GetComments,
    props<{ identifier: string, slug: string }>()
)
export const getCommentsSuccess = createAction(
    CommentActions.GetCommentsSuccess,
    props<{ comments: Comment[] }>()
)