import SpreadSheets from "../components/SpreadSheets";
import SetApiKey from "../components/SetApiKey";
import SpreadSheet from "../components/SpreadSheet";

const routes = {
  "": SpreadSheets,
  SET_API_KEY: SetApiKey,
  SPREADSHEET: SpreadSheet
};

export type Routes = keyof typeof routes;

export default routes;
