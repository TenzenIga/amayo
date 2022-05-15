import { ActionReducerMap } from "@ngrx/store";
import { IAppState } from "../state/app.state";
import { errorReducer } from "./error.reducer";
import { postReducer } from "./post.reducer";

export const appReducers: ActionReducerMap<IAppState, any> = {
    posts: postReducer,
    comments: null,
    subs: null,
    error: errorReducer,
} 