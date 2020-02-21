import { createAction } from "typesafe-actions";

export const addSpreadsheet = createAction(
  "ADD_SPREADSHEET",
  ({ id, title }: { id: string; title: string }) => ({
    id,
    time: new Date().getTime(),
    title
  })
)<{
  id: string;
  time: number;
  title: string;
}>();

export const removeSpreadsheet = createAction("REMOVE_SPREADSHEET")<{
  title: string;
}>();
