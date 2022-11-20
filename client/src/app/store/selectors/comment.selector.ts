import { createSelector } from "@ngrx/store";
import { IAppState } from "../state/app.state";
import { IPostCommentState } from "../state/comment.state";


const commentState = (state: IAppState) => state.comments;

export const selectComments = createSelector(
    commentState,
    (state: IPostCommentState) => state.comments
)
