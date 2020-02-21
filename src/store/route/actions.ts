import { createAction } from "typesafe-actions";
import { Routes } from "../../config/routes";

export const setRoute = createAction("SET_ROUTE")<{
  route: Routes;
}>();

export const goBack = createAction("GO_BACK")();
