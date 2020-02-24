import { combineReducers } from "redux";
import googleApiKey from "./apiKey/reducer";
import spreadsheets from "./spreadsheets/reducer";

export default combineReducers({
  googleApiKey,
  spreadsheets
});
