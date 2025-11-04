import { createAction, props } from '@ngrx/store';
import { Sub } from '../state/sub.state';
import { subPayload } from '@shared/interfaces/interfaces';

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
  DeleteSubSuccess = '[Sub] Delete Sub Success',
  CreateSub = '[Sub] Create Sub',
  CreateSubSuccess = '[Sub] Create Sub Success',
  GetSubsList = '[Sub] Get Subs List',
  GetSubsListSuccess = '[Sub] Get Subs List Success'
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

export const clearSub = createAction(SubActions.ClearSub);

export const subscribeToSub = createAction(
  SubActions.SubscribeToSub,
  props<{ name: string }>()
);

export const subscribeToSubSuccess = createAction(
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
);

export const deleteSubSuccess = createAction(
  SubActions.DeleteSubSuccess,
  props<{ sub: Sub }>()
);

export const createSub = createAction(
  SubActions.CreateSub,
  props<{ formData: FormData }>()
);

export const createSubSuccess = createAction(
  SubActions.CreateSubSuccess,
  props<{ sub: Sub }>()
);

export const getSubsList = createAction(SubActions.GetSubsList);
export const getSubsListSuccess = createAction(
  SubActions.GetSubsListSuccess,
  props<{ subs: Omit<Sub[], 'posts'> }>()
);

export const searchSubsClear = createAction(SubActions.SearchSubsClear);
