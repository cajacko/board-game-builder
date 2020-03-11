import { call } from "./mainProcess";
import * as Types from "../types";
import ReduxTypes from "ReduxTypes";

function dispatchActionToWindow(
  windowId: string | null,
  action: ReduxTypes.RootAction
) {
  return call<Types.SEND_ACTION_TO_WINDOW>("SEND_ACTION_TO_WINDOW", {
    windowId,
    type: "DISPATCH_REDUX_ACTION",
    payload: {
      windowId,
      action
    }
  });
}

export default dispatchActionToWindow;
