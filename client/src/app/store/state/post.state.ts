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
  user?: string;
  url?: string;
  username?: string;
  voteScore: number;
  commentCount: number;
  userVote?: number;
  subscriptionStatus: boolean;
  subImageUrl?: string;
}

export interface IPagination {
  currentPage?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface IPostState {
  post: Post;
  posts: Post[];
  loading: boolean;
  error: any;
  pagination: IPagination;
}

export const initialPagination: IPagination = {
  currentPage: 0,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false
};

export const initialPostState: IPostState = {
  post: null,
  posts: [],
  loading: false,
  error: null,
  pagination: initialPagination
};
