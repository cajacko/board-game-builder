import { Routes } from "../../config/routes";

export type Route = null | Routes;

export interface RouteState {
  activeRoute: Route;
  history: Route[];
}
