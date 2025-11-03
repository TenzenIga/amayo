import { createSelector } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { IPostState } from '../state/post.state';

const postState = (state: IAppState) => state.posts;

export const selectPosts = createSelector(
  postState,
  (state: IPostState) => state.posts
);

export const selectPost = createSelector(
  postState,
  (state: IPostState) => state.post
);

export const selectLoading = createSelector(
  postState,
  (state: IPostState) => state.loading
);

export const selectPagination = createSelector(
  postState,
  (state: IPostState) => state.pagination
);
