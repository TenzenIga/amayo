import { Injectable } from "@angular/core";
import { exhaustMap, map } from "rxjs/operators";

import { PostsService } from "@core/services/posts.service";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CommentActions from '../actions/comment.action';


@Injectable()
export class CommentEffects {
    constructor(
        private actions$: Actions,
        private postsService: PostsService
    ) { }

    getComments$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CommentActions.getComments),
            exhaustMap(action => this.postsService.getPostComments(action.identifier, action.slug).pipe(
                map(comments => CommentActions.getCommentsSuccess({ comments }))
            ))
        )
    })
}