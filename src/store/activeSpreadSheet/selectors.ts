import { createSelector } from "reselect";
import { ActiveSpreadSheetState, FullActiveSpreadSheet } from "./types";
import { SpreadsheetsState, Sheet } from "../spreadsheets/types";

export const activeSpreadsheetSelector = createSelector<
  ActiveSpreadSheetState,
  SpreadsheetsState,
  FullActiveSpreadSheet
>(
  state => state.activeSpreadSheet,
  state => state.spreadsheets,
  (activeSpreadsheet, spreadsheets) => {
    if (!activeSpreadsheet) return null;

    const spreadsheet = spreadsheets[activeSpreadsheet.title];

    if (!spreadsheet) return null;

    return {
      ...activeSpreadsheet,
      ...spreadsheet
    };
  }
);

export const sheetsSelector = createSelector<
  FullActiveSpreadSheet,
  string[] | null
>(activeSpreadsheetSelector, spreadsheet =>
  spreadsheet && spreadsheet.data
    ? spreadsheet.data.map(({ title }) => title)
    : null
);

export const sheetSelector = createSelector<
  FullActiveSpreadSheet,
  Sheet | null
>(activeSpreadsheetSelector, spreadsheet => {
  if (!spreadsheet) return null;
  if (!spreadsheet.data) return null;
  if (!spreadsheet.activeSheet) return null;

  const sheet = spreadsheet.data.find(
    ({ title }) => title === spreadsheet.activeSheet
  );

  if (!sheet) return null;

  return sheet;
});
