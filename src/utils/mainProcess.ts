import * as callAndReceive from "./callAndReceive";

export const call = callAndReceive.getCall(
  // @ts-ignore
  window.ipcRenderer && window.ipcRenderer.send
);

export const receive = callAndReceive.getReceive(
  // @ts-ignore
  window.ipcRenderer && window.ipcRenderer.send
);

callAndReceive.setUpListener(
  // @ts-ignore
  window.ipcRenderer &&
    // @ts-ignore
    window.ipcRenderer.on &&
    // @ts-ignore
    ((...args) => window.ipcRenderer.on(...args)),
  // @ts-ignore
  window.ipcRenderer && window.ipcRenderer.send
);
