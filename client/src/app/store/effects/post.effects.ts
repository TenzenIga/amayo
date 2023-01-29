import { Injectable } from '@angular/core';
import { PostsService } from '@core/services/posts.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, switchMap } from 'rxjs/operators';
import * as PostActions from '../actions/post.action';

@Injectable()
export class PostEffects {
  constructor(private actions$: Actions, private postsService: PostsService) {}

  getPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.getPosts),
      exhaustMap((_) =>
        this.postsService
          .getPosts()
          .pipe(map((posts) => PostActions.getPostsSuccess({ posts })))
      )
    );
  });

  getPost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.getPost),
      exhaustMap((action) =>
        this.postsService
          .getPost(action.identifier, action.slug)
          .pipe(map((post) => PostActions.getPostSuccess({ post })))
      )
    );
  });

  votePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.votePost),
      switchMap((action) =>
        this.postsService
          .voteOnPost(action.identifier, action.slug, action.value)
          .pipe(map((post) => PostActions.votePostSuccess({ post })))
      )
    );
  });
}
