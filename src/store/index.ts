import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer, PERSIST } from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
import rootReducer from "./reducers";
import * as Types from "../types";
import { receive } from "../utils/mainProcess";
import windowId from "../config/windowId";
import isMainRenderer from "../config/isMainRenderer";
import { call } from "../utils/mainProcess";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["isPrintWindow", "printSettings"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let per: any = null;

let store = createStore(
  persistedReducer,
  applyMiddleware(logger, store => next => action => {
    const state = next(action);

    // Don't save redux changes outside of the main renderer
    if (action.type === PERSIST && !isMainRenderer && per && per.pause) {
      per.pause();
    }

    // When persist is complete indicate we're good to show stuff
    setTimeout(() => {
      call<Types.APP_RENDERED>("APP_RENDERED", { windowId }).catch(
        console.error
      );
      // Need timeout as content isn't always painted
    }, 500);

    return state;
  })
);

// @ts-ignore persist store doesn't accept that payload is required
const persistor = persistStore(store);

per = persistor;

receive<Types.DISPATCH_REDUX_ACTION>(
  "DISPATCH_REDUX_ACTION",
  ({ requestPayload }) => {
    if (requestPayload.windowId !== windowId) return;

    store.dispatch(requestPayload.action);

    // Gives time to rerender before we move on
    return new Promise(resolve => setTimeout(resolve, 200));
  }
);

export { store, persistor };
