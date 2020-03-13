import { createSelector } from "reselect";
import ReduxTypes from "ReduxTypes";
import { RouteComponentProps } from "react-router-dom";
import {
  Spreadsheet,
  SpreadsheetsState,
  Sheet,
  ExtendedSpreadsheet,
  ExtendedSheet
} from "./types";

interface RouteMatchParams {
  spreadsheetId?: string;
  sheetId?: string;
}

export const spreadsheetsSelector = createSelector<
  ReduxTypes.RootState,
  SpreadsheetsState,
  Spreadsheet[]
>(
  (state: ReduxTypes.RootState): SpreadsheetsState => state.spreadsheets,
  spreadsheets => Object.values(spreadsheets)
);

export const filterRows = createSelector<
  Sheet,
  string,
  Sheet,
  string,
  { rows: Sheet["rows"]; error?: string }
>(
  sheet => sheet,
  (sheet, filter) => filter.trim(),
  (sheet, filter) => {
    let error;

    if (filter === "") {
      return {
        rows: sheet.rows
      };
    }

    return {
      rows: sheet.rows.filter(row => {
        // eslint-disable-next-line
        const data = row.reduce((obj, val, i) => {
          const heading = (
            sheet.headings[i]?.toString() || `Column ${i}`
          ).trim();

          return { ...obj, [heading]: val };
        }, {});

        try {
          // eslint-disable-next-line
          return !!eval(filter);
        } catch (e) {
          error = e;
          console.error(e);
          return true;
        }
      }),
      error
    };
  }
);

export const activeSpreadsheetSelector = createSelector<
  ReduxTypes.RootState,
  RouteComponentProps<RouteMatchParams>["match"],
  SpreadsheetsState,
  string | undefined,
  ExtendedSpreadsheet | null
>(
  (state: ReduxTypes.RootState): SpreadsheetsState => state.spreadsheets,
  (
    state: SpreadsheetsState,
    match: RouteComponentProps<RouteMatchParams>["match"]
  ): string | undefined => match.params.spreadsheetId,
  (
    spreadsheets: SpreadsheetsState,
    spreadsheetId: string | undefined
  ): ExtendedSpreadsheet | null => {
    if (!spreadsheetId) return null;

    const spreadsheet = spreadsheets[spreadsheetId];

    if (!spreadsheet) return null;

    const mergedSpreadsheet = Object.assign({}, spreadsheet);

    if (mergedSpreadsheet.data) {
      mergedSpreadsheet.data = mergedSpreadsheet.data.map(sheet => ({
        ...sheet,
        filter: spreadsheet.filters[sheet.title],
        designMap: spreadsheet.designMap[sheet.title]
      }));
    }

    return mergedSpreadsheet;
  }
);

export const sheetSelector = createSelector<
  ReduxTypes.RootState,
  RouteComponentProps<RouteMatchParams>["match"],
  ExtendedSpreadsheet | null,
  string | undefined,
  ExtendedSheet | null
>(
  activeSpreadsheetSelector,
  (state, match) => match.params.sheetId,
  (
    spreadsheet: ExtendedSpreadsheet | null,
    sheetId: string | undefined
  ): ExtendedSheet | null => {
    if (!spreadsheet) return null;
    if (!spreadsheet.data) return null;
    if (!sheetId) return null;

    const sheet = spreadsheet.data.find(({ title }) => title === sheetId);

    if (!sheet) return null;

    return sheet;
  }
);

export const sheetsSelector = createSelector<
  ReduxTypes.RootState,
  RouteComponentProps<RouteMatchParams>["match"],
  ExtendedSpreadsheet | null,
  string | undefined,
  string[] | null
>(
  activeSpreadsheetSelector,
  (state, match) => match.params.spreadsheetId,
  (spreadsheet: ExtendedSpreadsheet | null): string[] | null =>
    spreadsheet && spreadsheet.data
      ? spreadsheet.data.map(({ title }) => title)
      : null
);
