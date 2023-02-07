import { createSelector } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { ISubState } from '../state/sub.state';

const subState = (state: IAppState) => state.subs;

export const selectSub = createSelector(
  subState,
  (state: ISubState) => state.sub
);

export const selectTopSubs = createSelector(
  subState,
  (state: ISubState) => state.topSubs
);

export const suggestedSubs = createSelector(
  subState,
  (state: ISubState) => state.suggestions
);
