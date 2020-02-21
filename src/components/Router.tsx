import React from "react";
import { useSelector, useDispatch } from "react-redux";
import routes from "../config/routes";
import actions from "../store/actions";

function Router() {
  const googleApiKey = useSelector(({ googleApiKey }) => googleApiKey);
  let route = useSelector(({ route }) => route.activeRoute);
  let hasHistory = useSelector(({ route }) => route.history.length);
  const dispatch = useDispatch();

  const hasApiKey = !!googleApiKey;

  if (!hasApiKey) route = "SET_API_KEY";

  const Component = route ? routes[route] : routes[""];

  return (
    <>
      {!!hasHistory && hasApiKey && (
        <button onClick={() => dispatch(actions.route.goBack())}>Back</button>
      )}
      {route !== "SET_API_KEY" && (
        <button
          onClick={() =>
            dispatch(actions.route.setRoute({ route: "SET_API_KEY" }))
          }
        >
          Reset Api Key
        </button>
      )}
      <Component />
    </>
  );
}

export default Router;
