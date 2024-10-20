import { Injectable } from '@angular/core';
import { exhaustMap, map, switchMap } from 'rxjs/operators';

import { PostsService } from '@core/services/posts.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CommentActions from '../actions/comment.action';
import { MiscService } from '@core/services/misc.service';

@Injectable()
export class CommentEffects {
  constructor(
    private actions$: Actions,
    private postsService: PostsService,
    private miscService: MiscService
   ) {}

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
        this.miscService
          .voteOnComment(action.identifier, action.slug, action.value)
          .pipe(
            map((comment) => CommentActions.voteCommentSuccess({ comment }))
          )
      )
    );
  });
}
