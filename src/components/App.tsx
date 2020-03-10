import React from "react";
import { Provider } from "react-redux";
import { createGlobalStyle } from "styled-components";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "../store";
import Router from "./Router";
import { send } from "../utils/ipcRenderer";

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
    send("READY");
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
