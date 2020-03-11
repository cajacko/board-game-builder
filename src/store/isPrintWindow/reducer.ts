import { createReducer } from "typesafe-actions";
import * as actions from "./actions";

const reducer = createReducer<boolean>(false).handleAction(
  actions.setIsPrintWindow,
  (state, action) => action.payload.isPrintWindow
);

export default reducer;
