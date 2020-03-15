import { createReducer } from "typesafe-actions";
import * as actions from "./actions";
import { SpreadsheetsState, Spreadsheet } from "./types";

const initialSheet: Spreadsheet | null =
  process.env.REACT_APP_INITIAL_SPREADSHEET_ID &&
  process.env.REACT_APP_INITIAL_SPREADSHEET_TITLE
    ? {
        id: process.env.REACT_APP_INITIAL_SPREADSHEET_ID,
        title: process.env.REACT_APP_INITIAL_SPREADSHEET_TITLE,
        dateCreated: new Date().getTime(),
        dateLastOpened: null,
        data: null,
        lastFetchedData: null,
        filters: {},
        designMap: {}
      }
    : null;

const defaultState: SpreadsheetsState = {};

if (initialSheet) {
  defaultState[initialSheet.title] = initialSheet;
}

const reducer = createReducer<SpreadsheetsState>(defaultState)
  .handleAction(
    actions.addSpreadsheet,
    (state, { payload: { id, time, title } }) => ({
      ...state,
      [title]: {
        id,
        title,
        dateCreated: time,
        dateLastOpened: null,
        data: null,
        lastFetchedData: null,
        filters: {},
        designMap: {}
      }
    })
  )
  .handleAction(actions.removeSpreadsheet, (state, { payload: { title } }) => {
    const newState = Object.assign({}, state);

    delete newState[title];

    return newState;
  })
  .handleAction(
    actions.setSpreadsheetData,
    (state, { payload: { data, time, title } }) => ({
      ...state,
      [title]: {
        ...state[title],
        data: data,
        lastFetchedData: time
      }
    })
  )
  .handleAction(
    actions.setFilter,
    (
      state,
      { payload: { filter, spreadsheetTitle, sheetTitle } }
    ): SpreadsheetsState => {
      return {
        ...state,
        [spreadsheetTitle]: {
          ...state[spreadsheetTitle],
          filters: {
            ...state[spreadsheetTitle].filters,
            [sheetTitle]: filter
          }
        }
      };
    }
  )
  .handleAction(
    actions.setDesign,
    (
      state,
      { payload: { component, spreadsheetTitle, sheetTitle } }
    ): SpreadsheetsState => {
      return {
        ...state,
        [spreadsheetTitle]: {
          ...state[spreadsheetTitle],
          designMap: {
            ...state[spreadsheetTitle].designMap,
            [sheetTitle]: {
              component: component,
              columnMapping: []
            }
          }
        }
      };
    }
  )
  .handleAction(
    actions.setColumnMap,
    (
      state,
      { payload: { sheetColumn, expectedColumn, spreadsheetTitle, sheetTitle } }
    ): SpreadsheetsState => {
      const columnMapping = state[spreadsheetTitle].designMap[
        sheetTitle
      ].columnMapping.slice();

      columnMapping[expectedColumn] = sheetColumn;

      return {
        ...state,
        [spreadsheetTitle]: {
          ...state[spreadsheetTitle],
          designMap: {
            ...state[spreadsheetTitle].designMap,
            [sheetTitle]: {
              ...state[spreadsheetTitle].designMap[sheetTitle],
              columnMapping
            }
          }
        }
      };
    }
  );

export default reducer;
