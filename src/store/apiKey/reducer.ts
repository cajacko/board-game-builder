import { createReducer } from "typesafe-actions";
import * as actions from "./actions";

const reducer = createReducer<null | string>(
  process.env.INITIAL_SPREADSHEET_ID || null
).handleAction(actions.setApiKey, (state, action) => action.payload.apiKey);

export default reducer;
