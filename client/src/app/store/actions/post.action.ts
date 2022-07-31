import { createAction, props } from "@ngrx/store";
import { Post } from "../state/post.state";

export type postPayload = {
    sub: string;
    title: string;
    body: string;
  };

export enum PostActions {
    GetPosts = '[Post] Get Posts',
    GetPostsSuccess = '[Post] Get Posts Success',
    GetPost = '[Post] Get Post',
    GetPostSuccess = '[Post] Get Post Success',
    CreatePost = '[Post] Create Post',
    CreatePostSuccess = '[Post] Create Post Success',
};

export const getPosts = createAction(
    PostActions.GetPosts
)
export const getPostsSuccess = createAction(
    PostActions.GetPostsSuccess,
    props<{posts:Post[]}>()
)

export const getPost = createAction(
    PostActions.GetPost,
    props<{identifier: string, slug: string }>()
)

export const getPostSuccess = createAction(
    PostActions.GetPostSuccess,
    props<{post:Post}>()
)

export const createPost = createAction(
    PostActions.CreatePost,
    props<{postdData: postPayload}>()
)

export const createPostSuccess = createAction(
    PostActions.CreatePostSuccess,
    props<{post: Post}>()
)