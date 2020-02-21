import { createSelector } from "reselect";
import { ActiveSpreadSheetState } from "./types";
import { Spreadsheet, SpreadsheetsState } from "../spreadsheets/types";

export const activeSpreadsheetSelector = createSelector<
  ActiveSpreadSheetState,
  SpreadsheetsState,
  (Spreadsheet & ActiveSpreadSheetState) | null
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
