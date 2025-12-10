import { createAction, props } from '@ngrx/store';
import { IPostState, Post } from '../state/post.state';
import { Sub } from '@shared/interfaces/interfaces';

export type postPayload = {
  sub: string;
  title: string;
  body: string;
  file: File;
};

export enum PostActions {
  GetPosts = '[Post] Get Posts',
  GetPostsSuccess = '[Post] Get Posts Success',
  GetFeed = '[Post] Get Feed',
  GetFeedSuccess = '[Post] Get Feed Success',
  GetPost = '[Post] Get Post',
  GetPostSuccess = '[Post] Get Post Success',
  CreatePost = '[Post] Create Post',
  CreatePostSuccess = '[Post] Create Post Success',
  VotePost = '[Post] Vote Post',
  VotePostSuccess = '[Post] Vote Post Success',
  SubscribeToSub = '[Post] Subscribe To Sub',
  SubscribeToSubSuccess = '[Post] Subscribe To Sub Success',
  UnsubscribeSub = '[Post] Unsubscribe To Sub',
  UnsubscribeSubSuccess = '[Post] Unsubscribe To Sub Success',
  DeletePost = '[Post] Delete Post',
  DeletePostSuccess = '[Post] Delete Post Success',
  EditPost = '[Post] Edit Post',
  EditPostSuccess = '[Post] Edit Post Success',
  ResetPosts = '[Post] Reset Posts'
}

export const getFeed = createAction(
  PostActions.GetFeed,
  props<{ page: number }>()
);
export const getFeedSuccess = createAction(
  PostActions.GetFeedSuccess,
  props<{ res: Pick<IPostState, 'posts' | 'pagination'> }>()
);

export const getPosts = createAction(
  PostActions.GetPosts,
  props<{ page: number }>()
);
export const getPostsSuccess = createAction(
  PostActions.GetPostsSuccess,
  props<{ res: Pick<IPostState, 'posts' | 'pagination'> }>()
);

export const getPost = createAction(
  PostActions.GetPost,
  props<{ identifier: string; slug: string }>()
);

export const getPostSuccess = createAction(
  PostActions.GetPostSuccess,
  props<{ post: Post }>()
);

export const createPost = createAction(
  PostActions.CreatePost,
  props<{ postdData: FormData }>()
);

export const createPostSuccess = createAction(
  PostActions.CreatePostSuccess,
  props<{ post: Post }>()
);

export const votePost = createAction(
  PostActions.VotePost,
  props<{ identifier: string; slug: string; value: number }>()
);

export const votePostSuccess = createAction(
  PostActions.VotePostSuccess,
  props<{ post: Post }>()
);

export const subscribeToSub = createAction(
  PostActions.SubscribeToSub,
  props<{ name: string }>()
);

export const subscribeToSubSuccess = createAction(
  PostActions.SubscribeToSubSuccess,
  props<{ sub: Sub }>()
);

export const unsubscribeSub = createAction(
  PostActions.UnsubscribeSub,
  props<{ name: string }>()
);

export const unsubscribeSubSuccess = createAction(
  PostActions.UnsubscribeSubSuccess,
  props<{ sub: Sub }>()
);

export const deletePost = createAction(
  PostActions.DeletePost,
  props<{ identifier: string; slug: string }>()
);

export const deletePostSuccess = createAction(
  PostActions.DeletePostSuccess,
  props<{ post: Post }>()
);

export const editPost = createAction(
  PostActions.EditPost,
  props<{ identifier: string; slug: string; postdData: FormData }>()
);

export const editPostSuccess = createAction(
  PostActions.EditPostSuccess,
  props<{ post: Post }>()
);

export const resetPosts = createAction(PostActions.ResetPosts);
