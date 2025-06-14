import { inject, Inject, Injectable } from "@angular/core";
import { UserService } from "@core/services/user.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as UserActions from '../actions/user.action';
import { exhaustMap, map } from "rxjs";
@Injectable()
export class UserEffect {
    private actions$: Actions = inject(Actions);
    private userService:UserService = inject(UserService);
    
    public readonly getUserInfo$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(UserActions.getUserInfo),
        exhaustMap((action) =>
        this.userService
            .getUserInfo(action.username)
            .pipe(map((user) => UserActions.getUserInfoSuccess({ user })))
            )
        );
    });
}