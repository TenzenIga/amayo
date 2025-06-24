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
    posts: state.posts.map((p) =>{
      if(p.identifier === payload.post.identifier){
        return {...p, userVote: payload.post.userVote, voteScore: payload.post.voteScore}
      }
      return p
    }
    )
  })),
  on(PostActions.createPost, (state) => ({ ...state, loading: true })),
  on(PostActions.createPostSuccess, (state) => ({ ...state, loading: false })),
  on(PostActions.subscribeToSub, (state) =>({...state, subscribeToSubLoading: true})),
  on(PostActions.subscribeToSubSuccess, (state, payload) =>({...state, posts: state.posts.map(p => { 
    if(p.subName === payload.sub.name){
      p = {...p, subscriptionStatus:true}
      }
    return p
   }), subscribeToSubLoading: false})),
  on(PostActions.unsubscribeSub, (state) =>({...state, subscribeToSubLoading: true})),
  on(PostActions.unsubscribeSubSuccess, (state, payload) =>({...state, posts: state.posts.map(p => { 
    if(p.subName === payload.sub.name){
      p = {...p, subscriptionStatus:false}
      }
    return p
   }), subscribeToSubLoading: false})),

);
