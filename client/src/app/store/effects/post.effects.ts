import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '@core/services/posts.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, switchMap } from 'rxjs/operators';
import slugify from 'slugify';
import * as PostActions from '../actions/post.action';
import { SubService } from '@core/services/sub.service';

@Injectable()
export class PostEffects {
  private actions$: Actions = inject(Actions);
  private postsService: PostsService = inject(PostsService);
  private subService: SubService = inject(SubService);
  private router: Router = inject(Router);

  public readonly getPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.getPosts),
      exhaustMap((_) =>
        this.postsService
          .getPosts()
          .pipe(map((posts) => PostActions.getPostsSuccess({ posts })))
      )
    );
  });

  public readonly getPost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.getPost),
      exhaustMap((action) =>
        this.postsService
          .getPost(action.identifier, action.slug)
          .pipe(map((post) => PostActions.getPostSuccess({ post })))
      )
    );
  });

  public readonly votePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.votePost),
      switchMap((action) =>
        this.postsService
          .voteOnPost(action.identifier, action.slug, action.value)
          .pipe(map((post) => PostActions.votePostSuccess({ post })))
      )
    );
  });

  public readonly subscribeToSub$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.subscribeToSub),
      switchMap((action) =>
        this.subService
          .subscribeToSub(action.name)
          .pipe(map((sub) => PostActions.subscribeToSubSuccess({ sub })))
      )
    );
  });

  public readonly createPost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.createPost),
      switchMap((action) =>
        this.postsService
          .createPost(action.postdData)
          .pipe(map((post) => PostActions.createPostSuccess({ post })))
      )
    );
  });

  public readonly newPostRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PostActions.createPostSuccess),
        map(({ post }) =>
          this.router.navigate([
            `/r/${post.subName}/${post.identifier}/${slugify(post.title, '_')}`
          ])
        )
      ),
    { dispatch: false }
  );
}
