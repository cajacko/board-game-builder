import { createReducer } from "typesafe-actions";
import * as actions from "./actions";

const reducer = createReducer<null | string>(
  process.env.REACT_APP_GOOGLE_API_KEY || null
).handleAction(actions.setApiKey, (state, action) => action.payload.apiKey);

export default reducer;
