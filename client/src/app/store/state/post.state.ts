import { Sub } from "./sub.state";

enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Succeeded = 'succeeded',
  Failed = 'failed'
}
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
  post: Post,
  posts: Post[]
  status: Status
}
export const initialPostState: IPostState = {
  post: null,
  posts: [],
  status: Status.Idle
} 
