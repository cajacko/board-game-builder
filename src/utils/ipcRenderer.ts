let id = 0;

export function send(type: string, payload: object = {}) {
  // @ts-ignore
  if (!window.ipcRenderer) return Promise.resolve();

  try {
    id += 1;

    const newPayload = Object.assign({}, payload);

    // @ts-ignore
    newPayload.id = id;

    // @ts-ignore
    window.ipcRenderer.send(type, JSON.stringify(newPayload));

    return new Promise((resolve, reject) => {
      // @ts-ignore
      window.ipcRenderer.on(type, (event, args) => {
        const data = JSON.parse(args);

        // @ts-ignore
        if (data.id !== newPayload.id) return;

        if (data.state === "ERROR") {
          reject();
        } else {
          resolve(data);
        }
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
}
