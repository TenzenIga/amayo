import { inject, Injectable } from '@angular/core';
import { SubService } from '@core/services/sub.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, switchMap } from 'rxjs/operators';
import * as SubActions from '../actions/sub.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class SubEffect {
  private subService: SubService = inject(SubService);
  private actions$: Actions = inject(Actions);
  private router: Router = inject(Router);
  private toastr: ToastrService = inject(ToastrService);
  public readonly getSub$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubActions.getSub),
      exhaustMap((action) =>
        this.subService
          .getSub(action.subName)
          .pipe(map((sub) => SubActions.getSubSuccess({ sub })))
      )
    );
  });

  public readonly getTopSubs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubActions.getTopSubs),
      exhaustMap(() =>
        this.subService
          .getTopSubs()
          .pipe(map((topSubs) => SubActions.getTopSubsSuccess({ topSubs })))
      )
    )
  );

  public readonly searchSubs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubActions.searchSubs),
      switchMap((action) =>
        this.subService
          .searchSubs(action.subName)
          .pipe(
            map((suggestions) => SubActions.searchSubsSuccess({ suggestions }))
          )
      )
    )
  );

  public readonly subscribeToSub$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubActions.subscribeToSub),
      switchMap((action) =>
        this.subService
          .subscribeToSub(action.name)
          .pipe(map((sub) => SubActions.subscribeToSubSuccess({ sub })))
      )
    );
  });
  public readonly unsubscribeSub$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubActions.unsubscribeSub),
      switchMap((action) =>
        this.subService
          .unsubscribeSub(action.name)
          .pipe(map((sub) => SubActions.unsubscribeSubSuccess({ sub })))
      )
    );
  });

  public readonly createSub$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubActions.createSub),
      switchMap((action) =>
        this.subService
          .createSub(action.formData)
          .pipe(map((sub) => SubActions.createSubSuccess({ sub })))
      )
    );
  });

  public readonly deleteSub$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubActions.deleteSub),
      switchMap((action) =>
        this.subService
          .deleteSub(action.subName)
          .pipe(map((sub) => SubActions.deleteSubSuccess({ sub })))
      )
    );
  });

  public readonly deleteSubRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SubActions.deleteSubSuccess),
        map((_) => {
          this.router.navigate(['/']);
          this.toastr.success('Sub deleted!');
        })
      ),
    { dispatch: false }
  );
}
