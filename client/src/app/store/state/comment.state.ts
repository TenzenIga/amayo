export interface PostComment {
    createdAt: Date;
    updatedAt: Date;
    identifier: string;
    body: string;
    username: string;
    userVote: number;
    voteScore: number;
  }
  
  export interface IPostCommentState {
    comments: PostComment[]
}  
export const initialCommentState: IPostCommentState = {
    comments: null
} 