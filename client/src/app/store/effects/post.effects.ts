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
                map(posts =>  postActions.getPostsSuccess({posts}))
            ))
        )
    })

    getPost$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(postActions.getPost),
            exhaustMap(action => this.postsService.getPost(action.identifier, action.slug).pipe(
                map(post => postActions.getPostSuccess({post}))
            ))
        )
    })
}