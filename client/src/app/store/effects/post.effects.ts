import { Injectable } from "@angular/core";
import { PostsService } from "@core/services/posts.service";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from "rxjs/operators";
import * as postActions from '../actions/post.action';


@Injectable()
export class PostEffects {
    constructor(
        private actions$: Actions,
        private postsService: PostsService
    ){}

    getPosts$ = createEffect(() => {
       return this.actions$.pipe(
            ofType(postActions.getPosts),
            exhaustMap( _ => this.postsService.getPosts().pipe(
                map(posts => {
                    return postActions.getPostsSuccess({posts})
                })))
    )})
}