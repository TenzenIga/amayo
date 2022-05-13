import { Action, createReducer, on } from "@ngrx/store";
import * as PostActions  from "../actions/post.action";
import { initialPostState } from "../state/post.state";



export const postReducer = createReducer(
    initialPostState,
    on(PostActions.getPosts, (state) => ({...state, loading: true})),
    on(PostActions.getPostsSuccess, (state, payload) => ({...state, posts: payload.posts, loading: false}))
)

