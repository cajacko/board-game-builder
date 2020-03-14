import React from "react";
import { useSelector } from "react-redux";
import {
  Route,
  RouteComponentProps,
  useHistory,
  useRouteMatch,
  Switch,
  matchPath
} from "react-router-dom";
import styled from "styled-components";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SettingsIcon from "@material-ui/icons/Settings";
import Link from "@material-ui/core/Link";
import routes, { setApiKeyRoute } from "../config/routes";
import NoPrint from "../components/NoPrint";
import IconButton from "./IconButton";

const breadCrumbHeight = 50;

const BreadCrumbContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${breadCrumbHeight}px;
  background-color: #e0e0e0;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  z-index: 999;
`;

const BreadCrumbPadding = styled.div`
  height: ${breadCrumbHeight}px;
  flex: 1;
`;

const RightIcon = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

type Match = {
  spreadsheetId?: string;
  sheetId?: string;
  sheetView?: string;
};

function Router() {
  const googleApiKey = useSelector(({ googleApiKey }) => googleApiKey);
  const history = useHistory();
  const routerMatch = useRouteMatch<Match>();
  const match =
    routes
      .map(props => matchPath<Match>(window.location.pathname, props))
      .find(x => !!x) || routerMatch;

  console.log(match);

  const hasHistory = !!history.length;

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
        <BreadCrumbPadding />
        <BreadCrumbContainer>
          {!!hasHistory && hasApiKey && (
            <IconButton
              onClick={(e: any) => {
                e.preventDefault();
                history.goBack();
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
          )}

          <Breadcrumbs aria-label="breadcrumb">
            {hasApiKey ? (
              <Link
                color="inherit"
                href="/"
                onClick={(e: any) => {
                  e.preventDefault();
                  history.push("/");
                }}
              >
                Home
              </Link>
            ) : (
              <Typography color="textPrimary">Home</Typography>
            )}
            {match.params.spreadsheetId && (
              <Typography color="textPrimary">Spreadsheet</Typography>
            )}
            {match.params.spreadsheetId &&
              (match.params.sheetId ? (
                <Link
                  color="inherit"
                  href="/"
                  onClick={(e: any) => {
                    e.preventDefault();
                    history.push(`/spreadsheet/${match.params.spreadsheetId}`);
                  }}
                >
                  {decodeURIComponent(match.params.spreadsheetId)}
                </Link>
              ) : (
                <Typography color="textPrimary">
                  {decodeURIComponent(match.params.spreadsheetId)}
                </Typography>
              ))}
            {match.params.sheetId && (
              <Typography color="textPrimary">Sheet</Typography>
            )}
            {match.params.sheetId && (
              <Typography color="textPrimary">
                {decodeURIComponent(match.params.sheetId)}
              </Typography>
            )}
          </Breadcrumbs>

          <RightIcon>
            <IconButton
              onClick={(e: any) => {
                e.preventDefault();
                history.push("/set-api-key");
              }}
            >
              <SettingsIcon />
            </IconButton>
          </RightIcon>
        </BreadCrumbContainer>
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
