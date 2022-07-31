import { createAction, props } from "@ngrx/store";
import { Sub } from "../state/sub.state";

export enum SubActions {
    GetSub = '[Sub] Get Sub',
    GetSubSuccess = '[Sub] Get Sub Success',
};

export const getSub = createAction(
    SubActions.GetSub,
    props<{subName: string}>()
)
export const getSubSuccess = createAction(
    SubActions.GetSubSuccess,
    props<{sub: Sub}>()
)