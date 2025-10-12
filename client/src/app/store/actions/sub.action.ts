import { createAction, props } from '@ngrx/store';
import { Sub } from '../state/sub.state';

export enum SubActions {
  GetSub = '[Sub] Get Sub',
  GetSubSuccess = '[Sub] Get Sub Success',
  GetTopSubs = '[Sub] Get Top Subs',
  GetTopSubsSuccess = '[Sub] Get Top Subs Success',
  SearchSubs = '[Sub] Search Subs',
  SearchSubsSuccess = '[Sub] Search Subs Success',
  SearchSubsClear = '[Sub] Search Subs Clear',
  SubscribeToSub = '[Sub] Subscribe to Sub',
  SubscribeToSubSuccess = '[Sub] Subscribe to Sub Success',
  UnsubscribeSub = '[Sub] Unsubscribe to Sub',
  UnsubscribeSubSuccess = '[Sub] Unsubscribe to Sub Success',
  ClearSub = '[Sub] Clear Sub',
  DeleteSub = '[Sub] Delete Sub',
  DeleteSubSuccess = '[Sub] Delete Sub Success'
}

export const getSub = createAction(
  SubActions.GetSub,
  props<{ subName: string }>()
);
export const getSubSuccess = createAction(
  SubActions.GetSubSuccess,
  props<{ sub: Sub }>()
);

export const getTopSubs = createAction(SubActions.GetTopSubs);

export const getTopSubsSuccess = createAction(
  SubActions.GetTopSubsSuccess,
  props<{ topSubs: Sub[] }>()
);

export const searchSubs = createAction(
  SubActions.SearchSubs,
  props<{ subName: string }>()
);

export const searchSubsSuccess = createAction(
  SubActions.SearchSubsSuccess,
  props<{ suggestions: Sub[] }>()
);


export const clearSub = createAction(
  SubActions.ClearSub
);

export const subscribeToSub = createAction(
    SubActions.SubscribeToSub,
    props<{ name: string }>()
  );

export const subscribeToSubSuccess= createAction(
    SubActions.SubscribeToSubSuccess,
    props<{ sub: Sub }>()
  );

export const unsubscribeSub = createAction(
    SubActions.UnsubscribeSub,
    props<{ name: string }>()
  );

export const unsubscribeSubSuccess = createAction(
    SubActions.UnsubscribeSubSuccess,
    props<{ sub: Sub }>()
);

export const deleteSub = createAction(
  SubActions.DeleteSub,
  props<{ subName: string }>()
)

export const deleteSubSuccess = createAction (
  SubActions.DeleteSubSuccess
)

export const searchSubsClear = createAction(SubActions.SearchSubsClear);
