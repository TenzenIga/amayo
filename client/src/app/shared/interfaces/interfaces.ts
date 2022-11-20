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
};

export type subPayload = {
  name: string;
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
}

export interface Sub {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  description: string;
  imageUrn?: string;
  bannerUrn?: string;
  posts: Post[];
  imageUrl?: string;
  bannerUrl?: string;
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