import React from "react";
import { useSelector } from "react-redux";
import {
  Route,
  RouteComponentProps,
  useHistory,
  useRouteMatch,
  Switch
} from "react-router-dom";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import routes, { setApiKeyRoute } from "../config/routes";
import NoPrint from "../components/NoPrint";

function Router() {
  const googleApiKey = useSelector(({ googleApiKey }) => googleApiKey);
  const history = useHistory();
  const match = useRouteMatch();

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
      <NoPrint>
        <Breadcrumbs aria-label="breadcrumb">
          {hasApiKey && (
            <Link color="inherit" href="/" onClick={() => history.push("/")}>
              Home
            </Link>
          )}
          {route !== "/set-api-key" && (
            <Link
              color="inherit"
              href="/set-api-key"
              onClick={() => history.push("/set-api-key")}
            >
              Reset Api Key
            </Link>
          )}
          {!!hasHistory && hasApiKey && (
            <Link color="inherit" href="/back" onClick={() => history.goBack()}>
              Back
            </Link>
          )}
        </Breadcrumbs>
      </NoPrint>
      <Switch>
        {routes.map(route => (
          <Route {...route} />
        ))}
      </Switch>
    </>
  );
}

export default Router;
