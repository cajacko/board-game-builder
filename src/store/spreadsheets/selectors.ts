import { createSelector } from "reselect";
import { Spreadsheet, SpreadsheetsState } from "./types";

export const spreadsheetsSelector = createSelector<
  SpreadsheetsState,
  Spreadsheet[]
>(
  state => state.spreadsheets,
  spreadsheets => Object.values(spreadsheets)
);
