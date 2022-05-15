import { createSelector } from "@ngrx/store";
import { IAppState } from "../state/app.state";
import { IPostState } from "../state/post.state";

const postState = (state: IAppState) => state.posts;

export const selectPosts = createSelector(
    postState,
    (state: IPostState) => state.posts
)
