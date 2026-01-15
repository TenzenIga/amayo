interface Subscription {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  title: string | null;
  description: string | null;
  imageUrn: string | null;
  bannerUrn: string | null;
  rules: string | null;
  username: string;
  imageUrl: string;
  subscribersCount: number;
}

export interface User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  username: string;
  userImage: string | null;
  subscriptions: Subscription[];
  userImageUrl: string;
  nickname: string | null;
  description: string | null;
  notificationsComments: boolean;
  notificationsReplies: boolean;
  notificationsLikes: boolean;
}

export interface IUserState {
  userData: User;
}

export const initialUserState: IUserState = {
  userData: null
};
