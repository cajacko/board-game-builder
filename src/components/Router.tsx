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
import { send } from "../utils/ipcRenderer";
import getIsPrintLayout from "../utils/getIsPrintLayout";
import mmToPx from '../utils/mmToPx';

// In mm. This is the A4 size for my printer
const maxPrintSize = {
  width: 201,
  height: 288
}

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

  function screenshot() {
    send("SCREENSHOT", { height: mmToPx(maxPrintSize.height), width: mmToPx(maxPrintSize.width), x: 0, y: 0 });
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
          <button onClick={screenshot}>Screenshot</button>
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
