import { inject, Injectable } from '@angular/core';
import { exhaustMap, map, switchMap } from 'rxjs/operators';

import { PostsService } from '@core/services/posts.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CommentActions from '../actions/comment.action';
import { Comment } from '@shared/interfaces/interfaces';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class CommentEffects {
  private toastr: ToastrService = inject(ToastrService);
  private actions$: Actions = inject(Actions);
  private postsService: PostsService = inject(PostsService);
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

  deleteComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CommentActions.deleteComment),
      switchMap((action) =>
        this.postsService.deleteComment(action.identifier).pipe(
          map((comment: Comment) => {
            this.toastr.success('Comment deleted!');
            return CommentActions.deleteCommentSuccess({ comment });
          })
        )
      )
    );
  });
}
