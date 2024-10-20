import { createAction, props } from '@ngrx/store';
import { Sub } from '@shared/interfaces/interfaces';

export enum MiscActions {
  SubscribeToSub = '[Misc] Subscribe to Sub',
  SubscribeToSubSuccess = '[Misc] Subscribe to Sub Success',
}


export const subscribeToSub = createAction(
    MiscActions.SubscribeToSub,
    props<{ name: string }>()
)

export const subscribeToSubSuccess = createAction(
    MiscActions.SubscribeToSubSuccess,
    props<{sub: Sub }>()
)