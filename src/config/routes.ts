import SpreadSheets from "../components/SpreadSheets";
import SetApiKey from "../components/SetApiKey";
import SpreadSheet from "../components/SpreadSheet";
import Sheet from "../components/Sheet";
import { RouteProps } from "react-router-dom";

interface ExtendedRouteProps extends RouteProps {
  key: string;
}

export const setApiKeyRoute: ExtendedRouteProps = {
  key: "set-api-key",
  component: SetApiKey,
  path: "/set-api-key",
  exact: true
};

const routes: ExtendedRouteProps[] = [
  {
    component: Sheet,
    path: "/spreadsheet/:spreadsheetId/sheet/:sheetId",
    key: "/spreadsheet/:spreadsheetId/sheet/:sheetId",
    exact: true
  },
  {
    component: SpreadSheet,
    path: "/spreadsheet/:spreadsheetId",
    key: "/spreadsheet/:spreadsheetId",
    exact: true
  },
  setApiKeyRoute,
  {
    component: SpreadSheets,
    key: ""
  }
];

export default routes;
