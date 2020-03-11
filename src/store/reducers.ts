import { combineReducers } from "redux";
import googleApiKey from "./apiKey/reducer";
import spreadsheets from "./spreadsheets/reducer";
import isPrintWindow from "./isPrintWindow/reducer";
import printSettings from "./printSettings/reducer";

export default combineReducers({
  googleApiKey,
  spreadsheets,
  isPrintWindow,
  printSettings
});
