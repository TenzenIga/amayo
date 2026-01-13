import { inject, Injectable } from '@angular/core';
import { exhaustMap, map, switchMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CommentActions from '../actions/comment.action';
import { Comment } from '@shared/interfaces/interfaces';
import { ToastrService } from 'ngx-toastr';
import { CommentService } from '@core/services/comment.service';
import { MiscService } from '@core/services/misc.service';

@Injectable()
export class CommentEffects {
  private toastr: ToastrService = inject(ToastrService);
  private actions$: Actions = inject(Actions);
  private commentService: CommentService = inject(CommentService);
  private miscService: MiscService = inject(MiscService);

  getComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CommentActions.getComments),
      exhaustMap((action) =>
        this.commentService
          .getPostComments(action.identifier)
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
        this.miscService
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
        this.commentService
          .sendComment(action.identifier, action.value)
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
        this.commentService
          .sendComment(action.identifier, action.value, action.commentId)
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
        this.commentService.deleteComment(action.identifier).pipe(
          map((comment: Comment) => {
            this.toastr.success('Comment deleted!');
            return CommentActions.deleteCommentSuccess({ comment });
          })
        )
      )
    );
  });
}
