import { createReducer } from "typesafe-actions";
import * as actions from "./actions";

export interface State {
  height: number;
  width: number;
}

const reducer = createReducer<State | null>(null).handleAction(
  actions.setPrintSettings,
  (state, action) => action.payload
);

export default reducer;
