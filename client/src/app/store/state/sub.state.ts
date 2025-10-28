import { Status } from '../models/status';
import { Post } from './post.state';

export interface Sub {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  description: string;
  imageUrn?: string;
  bannerUrn?: string;
  posts: Post[];
  imageUrl?: string;
  bannerUrl?: string;
  subscribersCount?: number;
  subscriptionStatus: boolean;
}

export interface ISubState {
  subs: Sub[];
  sub: Sub;
  topSubs: Sub[];
  status: Status;
  suggestions: Sub[];
}
export const initialSubState: ISubState = {
  subs: null,
  sub: null,
  topSubs: [],
  suggestions: [],
  status: Status.Idle
};
