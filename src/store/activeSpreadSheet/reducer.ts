import { createReducer } from "typesafe-actions";
import * as actions from "./actions";
import { ActiveSpreadSheetState } from "./types";

const reducer = createReducer<ActiveSpreadSheetState>(null).handleAction(
  actions.setActiveSpreadSheet,
  (state, action) => ({
    title: action.payload.title
  })
);

export default reducer;
