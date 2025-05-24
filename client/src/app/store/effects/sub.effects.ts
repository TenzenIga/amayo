import { Injectable } from '@angular/core';
import { SubService } from '@core/services/sub.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, switchMap } from 'rxjs/operators';
import * as SubActions from '../actions/sub.action';

@Injectable()
export class SubEffect {
  constructor(private actions$: Actions, private subService: SubService) {}

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
  public readonly subscribeToSub$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubActions.subscribeToSub),
      switchMap((action) =>
        this.subService
          .subscribeToSub(action.name)
          .pipe(
            map((sub) => SubActions.subscribeToSubSuccess({ sub }))
          )
      )
    )
  );
}
