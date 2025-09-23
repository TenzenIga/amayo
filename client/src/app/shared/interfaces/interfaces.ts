export type signupPayload = {
  email: string;
  username: string;
  password: string;
};

export type loginPayload = {
  username: string;
  password: string;
};

export type postPayload = {
  sub: string;
  title: string;
  body: string;
  file:File;
};

export type subPayload = {
  name: string;
  description?:string;
  bannerUrn?:File;
  imageUrn?:File;
};
export interface Post {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
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
  postImageUrl?:string;
}

export interface Sub {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  name?: string;
  description: string;
  imageUrn?: string;
  bannerUrn?: string;
  posts: Post[];
  imageUrl?: string;
  bannerUrl?: string;
  subscribersCount?:number
  subscriptionStatus?: boolean
}

export interface Comment {
  createdAt: Date;
  updatedAt: Date;
  identifier: string;
  body: string;
  username: string;
  userVote: number;
  voteScore: number;
}

export interface ValdiateSubInput {
  fieldError: string | null
}