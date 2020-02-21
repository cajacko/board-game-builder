import { createReducer } from "typesafe-actions";
import * as actions from "./actions";
import { RouteState } from "./types";

const defaultState: RouteState = {
  activeRoute: null,
  history: []
};

const reducer = createReducer<RouteState>(defaultState)
  .handleAction(actions.setRoute, (state, action) => ({
    activeRoute: action.payload.route,
    history: [state.activeRoute, ...state.history]
  }))
  .handleAction(actions.goBack, state => {
    const lastRoute = state.history[0];

    if (!lastRoute) return defaultState;

    const newHistory = state.history.slice(1);

    return {
      activeRoute: lastRoute,
      history: newHistory
    };
  });

export default reducer;
