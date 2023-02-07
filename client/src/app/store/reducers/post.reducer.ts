import { createReducer, on } from '@ngrx/store';
import * as PostActions from '../actions/post.action';
import { initialPostState } from '../state/post.state';

export const postReducer = createReducer(
  initialPostState,
  on(PostActions.getPosts, (state) => ({ ...state, loading: true })),
  on(PostActions.getPostsSuccess, (state, payload) => ({
    ...state,
    posts: payload.posts,
    loading: false
  })),
  on(PostActions.getPost, (state) => ({ ...state, loading: true })),
  on(PostActions.getPostSuccess, (state, payload) => ({
    ...state,
    post: payload.post,
    loading: false
  })),
  on(PostActions.votePostSuccess, (state, payload) => ({
    ...state,
    post: payload.post,
    posts: state.posts.map((p) =>
      p.identifier === payload.post.identifier ? payload.post : p
    )
  })),
  on(PostActions.createPost, (state) => ({ ...state, loading: true })),
  on(PostActions.createPostSuccess, (state) => ({ ...state, loading: false }))
);
