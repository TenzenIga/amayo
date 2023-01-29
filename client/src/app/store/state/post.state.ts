import { Status } from '../models/status';
import { Sub } from './sub.state';

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
  post: Post;
  posts: Post[];
  loading: boolean;
  error: any;
}
export const initialPostState: IPostState = {
  post: null,
  posts: [],
  loading: false,
  error: null
};
