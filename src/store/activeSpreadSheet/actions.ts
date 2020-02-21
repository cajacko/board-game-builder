import { createAction } from "typesafe-actions";

export const setActiveSpreadSheet = createAction("SET_ACTIVE_SPREADSHEET")<{
  title: string;
}>();

export const setActiveSheet = createAction("SET_ACTIVE_SHEET")<{
  title: string | null;
}>();
