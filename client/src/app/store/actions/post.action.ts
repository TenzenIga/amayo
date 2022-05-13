import { createAction, props } from "@ngrx/store";
import { Post } from "../state/post.state";

export enum PostActions {
    GetPosts = '[Post] Get Posts',
    GetPostsSuccess = '[Post] Get Posts Success',
    GetPost = '[Post] Get Post',
    GetPostSuccess = '[Post] Get Post Success',
};

export const getPosts = createAction(
    PostActions.GetPosts
)
export const getPostsSuccess = createAction(
    PostActions.GetPostsSuccess,
    props<{posts:Post[]}>()
)