import React from "react";
import { Provider } from "react-redux";
import { createGlobalStyle } from "styled-components";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "../store";
import Router from "./Router";
import NoPrint from "./NoPrint";

const Global = createGlobalStyle<{ $hasBackground: boolean }>`
  html, body {
    background: ${(props) =>
      props.$hasBackground ? "#ffffff" : "transparent"};
    padding: 0;
    margin: 0;
  }
`;

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <NoPrint>
            {(isPrintWindow) => (
              <>
                <Global $hasBackground={!isPrintWindow} />
                <Router />
              </>
            )}
          </NoPrint>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
