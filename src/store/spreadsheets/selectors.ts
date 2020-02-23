import { createSelector } from "reselect";
import ReduxTypes from "ReduxTypes";
import { Spreadsheet, SpreadsheetsState, Sheet } from "./types";

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
