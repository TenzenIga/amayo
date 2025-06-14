import { createAction, props } from "@ngrx/store";
import { User } from "../state/user.state";

export enum UserActions {
    GetUserInfo = '[User] Get User Info',
    GetUserInfoSuccess = '[User] Get User Info Success'
}

export const getUserInfo = createAction(
    UserActions.GetUserInfo,
    props<{ username: string}>()
);

export const getUserInfoSuccess = createAction(
    UserActions.GetUserInfoSuccess,
    props<{user: User}>()
);

