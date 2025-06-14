import { createSelector } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { IUserState } from '../state/user.state';

const userState = (state: IAppState) => state.user;

export const selectUserInfo = createSelector(
  userState,
  (state: IUserState) => state.user
);
