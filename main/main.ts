import * as Types from "../src/types";
import * as callAndReceive from "../src/utils/callAndReceive";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import * as fs from "fs";
import { join } from "path";
import * as queryString from "query-string";

require("dotenv-flow").config();

app.allowRendererProcessReuse = true;

const backgroundWindows: {
  [key: string]: BrowserWindow;
} = {};

function createWindow() {
  let show = false;

  // Create the browser window.
  const win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 1400,
    height: 2000,
    webPreferences: {
      nodeIntegration: true
    },
    show
  });

  const { PORT, HOST, HTTPS } = process.env;

  const mainUrl = `http${HTTPS === "TRUE" ? "s" : ""}://${HOST}:${PORT}`;

  win.loadURL(mainUrl);

  function send(type: string, arg: string) {
    function callWin(individualWin: BrowserWindow) {
      if (individualWin.isDestroyed()) return;
      if (!individualWin.webContents) return;

      individualWin.webContents.send(type, arg);
    }

    callWin(win);

    Object.keys(backgroundWindows).forEach(windowId => {
      const individualWin = backgroundWindows[windowId];

      if (!individualWin.webContents || individualWin.isDestroyed()) {
        if (individualWin.destroy) individualWin.destroy();
        delete backgroundWindows[windowId];
        return;
      }

      callWin(individualWin);
    });
  }

  callAndReceive.setUpListener((...args) => {
    // @ts-ignore
    ipcMain.on(...args);
  }, send);

  const receive = callAndReceive.getReceive();

  const call = callAndReceive.getCall(send);

  const interval = setInterval(() => {
    if (show) {
      clearInterval(interval);
    } else {
      win.reload();
    }
  }, 2000);

  const resolveWindowsReady: { [key: string]: () => void } = {};

  receive<Types.CREATE_WINDOW>(
    "CREATE_WINDOW",
    ({ requestPayload: payload }) => {
      if (backgroundWindows[payload.windowId]) {
        if (backgroundWindows[payload.windowId].destroy) {
          backgroundWindows[payload.windowId].destroy();
        }

        delete backgroundWindows[payload.windowId];
      }

      const newWin = new BrowserWindow({
        width: payload.width,
        height: payload.height,
        webPreferences: {
          nodeIntegration: true
        },
        show: false
      });

      newWin.showInactive();

      if (!payload.show) {
        newWin.hide();
      }

      newWin.setContentBounds({
        height: payload.height,
        width: payload.width,
        x: 0,
        y: 0
      });

      const parsed = queryString.parseUrl(payload.url);
      parsed.query["window-id"] = payload.windowId;

      newWin.loadURL(queryString.stringifyUrl(parsed));

      backgroundWindows[payload.windowId] = newWin;

      newWin.on("close", () => {
        delete backgroundWindows[payload.windowId];
      });

      return new Promise(resolve => {
        resolveWindowsReady[payload.windowId] = resolve;
      });
    }
  );

  receive<Types.APP_RENDERED>(
    "APP_RENDERED",
    ({ requestPayload: { windowId } }) => {
      if (windowId) {
        if (resolveWindowsReady[windowId]) resolveWindowsReady[windowId]();

        return Promise.resolve();
      }

      if (show) return Promise.resolve();

      win.show();
      show = true;

      return Promise.resolve();
    }
  );

  receive<Types.OPEN_DESKTOP>("OPEN_DESKTOP", () => {
    shell.openItem(app.getPath("desktop"));
    return Promise.resolve();
  });

  receive<Types.SCREENSHOT>(
    "SCREENSHOT",
    ({ requestPayload: { height, width, x, y, filename, windowId } }) => {
      const printWin = backgroundWindows[windowId];

      if (!printWin) return Promise.reject();
      if (!printWin.webContents) return Promise.reject();

      return new Promise((resolve, reject) => {
        const path = join(
          app.getPath("desktop"),
          `${filename}.png` || "screenshot.png"
        );

        console.log({ path, height, width, x, y, windowId });

        printWin.webContents
          .capturePage({ height, width, x, y })
          .then(image => {
            console.log(image);
            fs.writeFile(path, image.toPNG(), "binary", function(err) {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
      });
    }
  );

  receive<Types.SEND_ACTION_TO_WINDOW>(
    "SEND_ACTION_TO_WINDOW",
    ({ requestPayload }: any) =>
      call(requestPayload.type, requestPayload.payload)
  );

  receive<Types.DESTROY_WINDOW>(
    "DESTROY_WINDOW",
    ({ requestPayload: payload }) => {
      if (backgroundWindows[payload.windowId]) {
        if (backgroundWindows[payload.windowId].destroy) {
          backgroundWindows[payload.windowId].destroy();
        }

        delete backgroundWindows[payload.windowId];
      } else {
        return Promise.reject();
      }

      return Promise.resolve();
    }
  );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
