import { Comment } from "@shared/interfaces/interfaces"

export interface IPostCommentState {
  comments: Comment[]
}
export const initialCommentState: IPostCommentState = {
  comments: []
} 