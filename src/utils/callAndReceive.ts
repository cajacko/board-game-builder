import { v4 as uuidv4 } from "uuid";
import * as Types from "../types";

const callsAwaitingResponse: Types.CallsAwaitingResponse = {};
const receiveCallbacks: Types.ReceiveCallbacks = {};

export function setUpListener<A extends Types.AllActions = Types.AllActions>(
  on: Types.On,
  send: Types.Send
) {
  if (!on) return;
  if (!send) return;

  on("MESSAGE", (event, args) => {
    const message = JSON.parse(args) as Types.Messages<A>;

    console.log("RECEIVE MESSAGE", message);

    if (message.messageType === "RESPONSE") {
      Object.keys(callsAwaitingResponse).some(actionId => {
        if (message.actionId !== actionId) return false;

        const callback = callsAwaitingResponse[actionId];

        const shouldDelete = callback(message);

        if (shouldDelete) {
          delete callsAwaitingResponse[actionId];
          return true;
        }

        return false;
      });
    } else {
      Object.keys(receiveCallbacks).some(type => {
        if (type !== message.type) return false;
        if (!receiveCallbacks[type]) return false;

        return Object.values(receiveCallbacks[type]).some(callback => {
          const promise = callback(message);

          if (!promise) return false;

          promise
            .then<Types.ResponseMessageSuccess<A>>(
              (responsePayload: A["response"]) => ({
                ...message,
                status: "SUCCESS",
                responsePayload,
                messageType: "RESPONSE"
              })
            )
            .catch<Types.ResponseMessageError<A>>((error: Error) => ({
              ...message,
              status: "ERROR",
              error: error.message || "Undefined Error",
              messageType: "RESPONSE"
            }))
            .then(responseMessage => {
              console.log("REPLY MESSAGE", responseMessage);
              send("MESSAGE", JSON.stringify(responseMessage));
            });

          return true;
        });
      });
    }
  });
}

function response<A extends Types.AllActions>(
  message: Types.RequestMessage<A>,
  callback: Types.ResponseCallback<A>
): void {
  callsAwaitingResponse[message.actionId] = callback;
}

export const getCall = (send: Types.Send) =>
  function call<A extends Types.AllActions>(
    type: A["type"],
    payload: A["payload"]
  ): Promise<A["response"]> {
    if (!send) return Promise.reject(new Error("No ipcRenderer"));

    const actionId = uuidv4();

    const message: Types.RequestMessage<A> = {
      actionId,
      type,
      messageType: "REQUEST",
      requestPayload: payload
    };

    const promise = new Promise<A["response"]>((resolve, reject) => {
      response<A>(message, responseMessage => {
        if (responseMessage.type !== type) return false;
        if (responseMessage.messageType !== "RESPONSE") return false;
        if (responseMessage.actionId !== actionId) return false;

        if (responseMessage.status === "SUCCESS") {
          resolve(responseMessage.responsePayload);
        } else {
          reject(responseMessage.error);
        }

        return true;
      });

      console.log("SEND MESSAGE", message);
      send("MESSAGE", JSON.stringify(message));
    });

    return promise;
  };

export const getReceive = () =>
  function receive<A extends Types.AllActions>(
    type: A["type"],
    callback: Types.RequestCallback<A>
  ) {
    const id = uuidv4();

    if (!receiveCallbacks[type]) receiveCallbacks[type] = {};

    receiveCallbacks[type][id] = callback;

    return () => {
      if (!receiveCallbacks[type]) return;

      delete receiveCallbacks[type][id];
    };
  };
