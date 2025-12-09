import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '@core/services/posts.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, switchMap } from 'rxjs/operators';
import slugify from 'slugify';
import * as PostActions from '../actions/post.action';
import { SubService } from '@core/services/sub.service';
import { ToastrService } from 'ngx-toastr';
import { IPostState } from '../state/post.state';

@Injectable()
export class PostEffects {
  private actions$: Actions = inject(Actions);
  private postsService: PostsService = inject(PostsService);
  private subService: SubService = inject(SubService);
  private router: Router = inject(Router);
  private toastr: ToastrService = inject(ToastrService);
  public readonly getPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.getPosts),
      exhaustMap((action) =>
        this.postsService
          .getPosts(action.page)
          .pipe(
            map((res: Pick<IPostState, 'posts' | 'pagination'>) =>
              PostActions.getPostsSuccess({ res })
            )
          )
      )
    );
  });
  public readonly getFeed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.getFeed),
      exhaustMap((action) =>
        this.postsService
          .getFeed(action.page)
          .pipe(
            map((res: Pick<IPostState, 'posts' | 'pagination'>) =>
              PostActions.getFeedSuccess({ res })
            )
          )
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
  public readonly unsubscribeSub$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.unsubscribeSub),
      switchMap((action) =>
        this.subService
          .unsubscribeSub(action.name)
          .pipe(map((sub) => PostActions.unsubscribeSubSuccess({ sub })))
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

  public readonly editPost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.editPost),
      switchMap((action) =>
        this.postsService
          .editPost(action.identifier, action.slug, action.postdData)
          .pipe(map((post) => PostActions.editPostSuccess({ post })))
      )
    );
  });

  public readonly newPostRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PostActions.createPostSuccess, PostActions.editPostSuccess),
        map(({ post }) =>
          this.router.navigate([
            `/r/${post.subName}/${post.identifier}/${slugify(post.title, '_')}`
          ])
        )
      ),
    { dispatch: false }
  );

  public readonly deletePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostActions.deletePost),
      switchMap((action) =>
        this.postsService
          .deletePost(action.identifier, action.slug)
          .pipe(map((post) => PostActions.deletePostSuccess({ post })))
      )
    );
  });

  public readonly deletePostRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PostActions.deletePostSuccess),
        map(({ post }) => {
          this.router.navigate([`/r/${post.subName}`]);
          this.toastr.success('Post deleted!');
        })
      ),
    { dispatch: false }
  );
}
