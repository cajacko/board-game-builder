const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const { join } = require("path");
const queryString = require("query-string");

require("dotenv-flow").config();

app.allowRendererProcessReuse = true;

function listen(type, callback) {
  ipcMain.on(type, (event, arg) => {
    const sentData = JSON.parse(arg);

    callback(sentData, (response, responseData) => {
      event.sender.send(
        type,
        JSON.stringify({
          type,
          id: sentData.id,
          state: response,
          responseData,
          sentData
        })
      );
    });
  });
}

function createWindow() {
  let show = false;

  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    show
  });

  const { PORT, HOST, HTTPS } = process.env;

  const mainUrl = `http${HTTPS === "TRUE" ? "s" : ""}://${HOST}:${PORT}`;

  win.loadURL(mainUrl);

  const interval = setInterval(() => {
    if (show) {
      clearInterval(interval);
    } else {
      win.reload();
    }
  }, 500);

  // const readyType = "READY";

  listen("READY", (args, respond) => {
    if (show) return;

    win.show();
    show = true;

    respond("SUCCESS");
  });

  // ipcMain.on(readyType, (event, arg) => {
  //   if (show) return;
  //   const { id } = JSON.parse(arg);

  //   win.show();
  //   show = true;

  //   event.sender.send(readyType, JSON.stringify({ id, state: "SUCCESS" }));
  // });

  listen("SCREENSHOT", (args, respond) => {
    const { height, width, x, y, timeout, filename } = args;

    // Create the browser window.
    const printWin = new BrowserWindow({
      width,
      height,
      webPreferences: {
        nodeIntegration: true
      },
      show: false
    });

    printWin.setContentBounds({ height, width, x: 0, y: 0 });

    const url = win.webContents.getURL();

    const parsed = queryString.parseUrl(url);

    parsed.query.print = true;

    printWin.loadURL(queryString.stringifyUrl(parsed));

    setTimeout(() => {
      const path = join(app.getPath("desktop"), filename || "screenshot.png");

      printWin.webContents.capturePage({ height, width, x, y }).then(image => {
        fs.writeFile(path, image.toPNG(), "binary", function(err) {
          if (err) {
            respond("ERROR");
          } else {
            respond("SUCCESS");
          }

          printWin.destroy();
        });
      });
    }, timeout || 500);
  });
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
