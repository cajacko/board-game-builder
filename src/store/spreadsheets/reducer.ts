import { createReducer } from "typesafe-actions";
import * as actions from "./actions";
import { SpreadsheetsState, Spreadsheet } from "./types";

const initialSheet: Spreadsheet | null =
  process.env.INITIAL_SPREADSHEET_ID && process.env.INITIAL_SPREADSHEET_TITLE
    ? {
        id: process.env.INITIAL_SPREADSHEET_ID,
        title: process.env.INITIAL_SPREADSHEET_TITLE,
        dateCreated: new Date().getTime(),
        dateLastOpened: null
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
        dateLastOpened: null
      }
    })
  )
  .handleAction(actions.removeSpreadsheet, (state, { payload: { title } }) => {
    const newState = Object.assign({}, state);

    delete newState[title];

    return newState;
  });

export default reducer;
