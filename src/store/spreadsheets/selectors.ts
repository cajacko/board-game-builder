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
import { RowWithOption } from "../../designs/types";

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

export const rowsWithQuantity = createSelector<
  ExtendedSheet["rows"],
  number | undefined,
  ExtendedSheet["rows"],
  number | undefined,
  ExtendedSheet["rows"]
>(
  originalRows => originalRows,
  (originalRows, quantityColumn) => quantityColumn,
  (originalRows, quantityColumn) => {
    const rows: ExtendedSheet["rows"] = [];

    originalRows.forEach(row => {
      rows.push(row);

      if (!quantityColumn) return;

      const quantity = row[quantityColumn];

      if (!quantity) return;

      for (var i = 1; i < quantity; i += 1) {
        rows.push(row);
      }
    });

    return rows;
  }
);

export const rowsWithOption = createSelector<
  ExtendedSheet["rows"],
  string[] | undefined,
  ExtendedSheet["rows"],
  string[] | undefined,
  RowWithOption[]
>(
  originalRows => originalRows,
  (originalRows, options) => options,
  (originalRows, options) => {
    const rows: RowWithOption[] = [];

    originalRows.forEach(row => {
      if (options) {
        options.forEach(option => {
          rows.push({
            option,
            row
          });
        });
      } else {
        rows.push({
          option: null,
          row
        });
      }
    });

    return rows;
  }
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
        designMap: spreadsheet.designMap[sheet.title],
        quantityColumn: spreadsheet.quantityMap[sheet.title],
        options: spreadsheet.optionsMap && spreadsheet.optionsMap[sheet.title]
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
