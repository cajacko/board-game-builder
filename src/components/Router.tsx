import React from "react";
import { useSelector, useDispatch } from "react-redux";
import routes from "../config/routes";
import actions from "../store/actions";

function Router() {
  const googleApiKey = useSelector(({ googleApiKey }) => googleApiKey);
  let route = useSelector(({ route }) => route.activeRoute);
  const dispatch = useDispatch();

  if (!googleApiKey) route = "SET_API_KEY";

  const Component = route ? routes[route] : routes[""];

  return (
    <>
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
