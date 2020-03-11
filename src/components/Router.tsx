import React from "react";
import { useSelector } from "react-redux";
import {
  Route,
  RouteComponentProps,
  useHistory,
  useRouteMatch,
  Switch
} from "react-router-dom";
import routes, { setApiKeyRoute } from "../config/routes";
import getIsPrintLayout from "../utils/getIsPrintLayout";

function Router() {
  const googleApiKey = useSelector(({ googleApiKey }) => googleApiKey);
  const history = useHistory();
  const match = useRouteMatch();

  const isPrintLayout = getIsPrintLayout();

  const hasHistory = !!history.length;
  const route = match.path;

  const hasApiKey = !!googleApiKey;

  if (!hasApiKey && setApiKeyRoute.component) {
    const Component = setApiKeyRoute.component;
    // @ts-ignore
    const props: RouteComponentProps = {};
    return <Component {...props} />;
  }

  return (
    <>
      {!isPrintLayout && (
        <>
          {!!hasHistory && hasApiKey && (
            <button onClick={() => history.goBack()}>Back</button>
          )}

          {route !== "/set-api-key" && (
            <button onClick={() => history.push("/set-api-key")}>
              Reset Api Key
            </button>
          )}
        </>
      )}
      <Switch>
        {routes.map(route => (
          <Route {...route} />
        ))}
      </Switch>
    </>
  );
}

export default Router;
