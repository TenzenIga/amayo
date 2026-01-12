import { Injectable } from '@angular/core';
import { exhaustMap, map, switchMap } from 'rxjs/operators';

import { PostsService } from '@core/services/posts.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CommentActions from '../actions/comment.action';
import { Comment } from '@shared/interfaces/interfaces';

@Injectable()
export class CommentEffects {
  constructor(private actions$: Actions, private postsService: PostsService) {}

  getComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CommentActions.getComments),
      exhaustMap((action) =>
        this.postsService
          .getPostComments(action.identifier, action.slug)
          .pipe(
            map((comments) => CommentActions.getCommentsSuccess({ comments }))
          )
      )
    );
  });

  voteComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CommentActions.voteComment),
      switchMap((action) =>
        this.postsService
          .voteOnComment(action.identifier, action.value)
          .pipe(
            map((comment: Comment) =>
              CommentActions.voteCommentSuccess({ comment })
            )
          )
      )
    );
  });

  createComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CommentActions.createComment),
      switchMap((action) =>
        this.postsService
          .sendComment(action.identifier, action.slug, action.value)
          .pipe(
            map((comment) => CommentActions.createCommentSuccess({ comment }))
          )
      )
    );
  });

  replyComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CommentActions.replyComment),
      switchMap((action) =>
        this.postsService
          .sendComment(
            action.identifier,
            action.slug,
            action.value,
            action.commentId
          )
          .pipe(
            map((comment) => CommentActions.replyCommentSuccess({ comment }))
          )
      )
    );
  });
}
