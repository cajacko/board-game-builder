import { createSelector } from "reselect";
import ReduxTypes from "ReduxTypes";
import { ActiveSpreadSheetState, FullActiveSpreadSheet } from "./types";
import { SpreadsheetsState, ExtendedSheet } from "../spreadsheets/types";

export const activeSpreadsheetSelector = createSelector<
  ReduxTypes.RootState,
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

    const mergedSpreadsheet = {
      ...activeSpreadsheet,
      ...spreadsheet
    };

    if (mergedSpreadsheet.data) {
      mergedSpreadsheet.data = mergedSpreadsheet.data.map(sheet => ({
        ...sheet,
        filter: spreadsheet.filters[sheet.title]
      }));
    }

    return mergedSpreadsheet;
  }
);

export const sheetsSelector = createSelector<
  ReduxTypes.RootState,
  FullActiveSpreadSheet,
  string[] | null
>(activeSpreadsheetSelector, spreadsheet =>
  spreadsheet && spreadsheet.data
    ? spreadsheet.data.map(({ title }) => title)
    : null
);

export const sheetSelector = createSelector<
  ReduxTypes.RootState,
  FullActiveSpreadSheet,
  ExtendedSheet | null
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
