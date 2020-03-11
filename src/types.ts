interface Action<T extends string, P = void, R = void> {
  type: T;
  payload: P;
  response: R;
}

export type APP_RENDERED = Action<"APP_RENDERED", { windowId: string | null }>;

export type CREATE_WINDOW = Action<
  "CREATE_WINDOW",
  {
    height: number;
    width: number;
    windowId: string;
    show: boolean;
    url: string;
  }
>;

export type SEND_ACTION_TO_WINDOW = Action<
  "SEND_ACTION_TO_WINDOW",
  {
    windowId: string | null;
    type: string;
    payload: any;
  }
>;

export type SCREENSHOT = Action<
  "SCREENSHOT",
  {
    windowId: string;
    height: number;
    width: number;
    x: number;
    y: number;
    filename: string;
  }
>;

export type DESTROY_WINDOW = Action<"DESTROY_WINDOW", { windowId: string }>;

export type WindowActions =
  | APP_RENDERED
  | CREATE_WINDOW
  | SEND_ACTION_TO_WINDOW
  | SCREENSHOT
  | DESTROY_WINDOW;

export type DISPATCH_REDUX_ACTION = Action<
  "DISPATCH_REDUX_ACTION",
  { windowId: string | null; action: any }
>;

export type MainActions = DISPATCH_REDUX_ACTION;

export type AllActions = WindowActions | MainActions;

export interface Message<A extends AllActions> {
  actionId: string;
  type: A["type"];
  requestPayload: A["payload"];
}

export interface RequestMessage<A extends AllActions> extends Message<A> {
  messageType: "REQUEST";
}

export interface ResponseMessage<A extends AllActions> extends Message<A> {
  messageType: "RESPONSE";
}

export interface ResponseMessageSuccess<A extends AllActions>
  extends ResponseMessage<A> {
  status: "SUCCESS";
  responsePayload: A["response"];
}

export interface ResponseMessageError<A extends AllActions>
  extends ResponseMessage<A> {
  status: "ERROR";
  error: string;
}

export type ResponseMessages<A extends AllActions = AllActions> =
  | ResponseMessageSuccess<A>
  | ResponseMessageError<A>;

export type Messages<A extends AllActions = AllActions> =
  | ResponseMessages<A>
  | RequestMessage<A>;

export type RequestCallback<A extends AllActions = AllActions> = (
  message: RequestMessage<A>
) => Promise<A["response"]> | void;

export type ResponseCallback<A extends AllActions = AllActions> = (
  message: ResponseMessages<A>
) => boolean;

export interface CallsAwaitingResponse {
  [key: string]: ResponseCallback<any>;
}

export type Send = (type: string, message: string) => void;

export type On = (
  type: string,
  callback: (event: { reply?: Send }, args: string) => void
) => void;

export interface ReceiveCallbacks {
  [key: string]: {
    [key: string]: RequestCallback<any>;
  };
}
