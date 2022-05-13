import { Sub } from "./sub.state";


export interface Post {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    index?: string;
    identifier?: string;
    title: string;
    slug?: string;
    body: string;
    subName?: string;
    sub?: Sub;
    user?: string;
    url?: string;
    username?: string;
    voteScore: number;
    commentCount: number;
    userVote?: number;
  }

  export interface IPostState {
      posts: Post[]
      loading: boolean
  }  
  export const initialPostState: IPostState = {
      posts: [],
      loading: false
  } 
