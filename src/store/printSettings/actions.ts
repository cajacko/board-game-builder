import { createAction } from "typesafe-actions";
import { State } from "./reducer";

export const setPrintSettings = createAction("SET_PRINT_SETTINGS")<State>();
