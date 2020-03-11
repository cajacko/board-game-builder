import { createAction } from "typesafe-actions";

export const setIsPrintWindow = createAction("SET_IS_PRINT_WINDOW")<{
  isPrintWindow: boolean;
}>();
