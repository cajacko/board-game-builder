import { createAction } from "typesafe-actions";

export const setActiveSpreadSheet = createAction("SET_ActiveSpreadSheet")<{
  title: string;
}>();
