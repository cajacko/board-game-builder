import { combineReducers } from "redux";
import googleApiKey from "./apiKey/reducer";
import route from "./route/reducer";
import spreadsheets from "./spreadsheets/reducer";
import activeSpreadSheet from "./activeSpreadSheet/reducer";

export default combineReducers({
  route,
  googleApiKey,
  spreadsheets,
  activeSpreadSheet
});
