import SpreadSheets from "../components/SpreadSheets";
import SetApiKey from "../components/SetApiKey";
import SpreadSheet from "../components/SpreadSheet";
import Sheet from "../components/Sheet";

const routes = {
  "": SpreadSheets,
  SET_API_KEY: SetApiKey,
  SPREADSHEET: SpreadSheet,
  SHEET: Sheet
};

export type Routes = keyof typeof routes;

export default routes;
