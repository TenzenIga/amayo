import { Injectable } from "@angular/core";
import { SubService } from "@core/services/sub.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map, pluck } from "rxjs/operators";
import * as subActions from '../actions/sub.action';

@Injectable()
export class SubEffect {
    constructor(
        private actions$: Actions,
        private subService: SubService
    ){}

    public getSub$ = createEffect(() =>{
        return this.actions$.pipe(
            ofType(subActions.getSub),
            exhaustMap( action => this.subService.getSub(action.subName).pipe(
                map(sub => {
                    return subActions.getSubSuccess({sub})
                })))
            )})
} 