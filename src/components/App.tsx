import React from "react";
import { Provider } from "react-redux";
import { createGlobalStyle } from "styled-components";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "../store";
import Router from "./Router";
import { call } from "../utils/mainProcess";
import * as Types from "../types";
import windowId from "../config/windowId";

const Global = createGlobalStyle`
  html, body {
    background: #ffffff;
    padding: 0;
    margin: 0;
  }

  body {
    -webkit-print-color-adjust: exact !important;
  }
`;

function App() {
  React.useEffect(() => {
    setTimeout(() => {
      call<Types.APP_RENDERED>("APP_RENDERED", { windowId }).catch(
        console.error
      );
      // Need timeout as content isn't always painted
    }, 500);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Global />
          <Router />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
