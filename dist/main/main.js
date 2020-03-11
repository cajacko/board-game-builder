"use strict";
exports.__esModule = true;
var callAndReceive = require("../src/utils/callAndReceive");
var electron_1 = require("electron");
var fs = require("fs");
var path_1 = require("path");
var queryString = require("query-string");
require("dotenv-flow").config();
electron_1.app.allowRendererProcessReuse = true;
var backgroundWindows = {};
function createWindow() {
    var show = false;
    // Create the browser window.
    var win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        show: show
    });
    var _a = process.env, PORT = _a.PORT, HOST = _a.HOST, HTTPS = _a.HTTPS;
    var mainUrl = "http" + (HTTPS === "TRUE" ? "s" : "") + "://" + HOST + ":" + PORT;
    win.loadURL(mainUrl);
    callAndReceive.setUpListener(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // @ts-ignore
        electron_1.ipcMain.on.apply(electron_1.ipcMain, args);
    });
    var receive = callAndReceive.getReceive();
    var call = callAndReceive.getCall(function (type, arg) {
        function callWin(individualWin) {
            individualWin.webContents.send(type, arg);
        }
        callWin(win);
        Object.keys(backgroundWindows).forEach(function (windowId) {
            var individualWin = backgroundWindows[windowId];
            if (!individualWin.webContents) {
                if (individualWin.destroy)
                    individualWin.destroy();
                delete backgroundWindows[windowId];
                return;
            }
            callWin(individualWin);
        });
    });
    var interval = setInterval(function () {
        if (show) {
            clearInterval(interval);
        }
        else {
            win.reload();
        }
    }, 500);
    var resolveWindowsReady = {};
    receive("CREATE_WINDOW", function (_a) {
        var payload = _a.requestPayload;
        if (backgroundWindows[payload.windowId]) {
            if (backgroundWindows[payload.windowId].destroy) {
                backgroundWindows[payload.windowId].destroy();
            }
            delete backgroundWindows[payload.windowId];
        }
        var newWin = new electron_1.BrowserWindow({
            width: payload.width,
            height: payload.height,
            webPreferences: {
                nodeIntegration: true
            },
            show: !!payload.show
        });
        newWin.setContentBounds({
            height: payload.height,
            width: payload.width,
            x: 0,
            y: 0
        });
        var parsed = queryString.parseUrl(payload.url);
        parsed.query["window-id"] = payload.windowId;
        newWin.loadURL(queryString.stringifyUrl(parsed));
        backgroundWindows[payload.windowId] = newWin;
        return new Promise(function (resolve) {
            resolveWindowsReady[payload.windowId] = resolve;
        });
    });
    receive("APP_RENDERED", function (_a) {
        var windowId = _a.requestPayload.windowId;
        if (windowId) {
            if (resolveWindowsReady[windowId])
                resolveWindowsReady[windowId]();
            return Promise.resolve();
        }
        if (show)
            return Promise.resolve();
        win.show();
        show = true;
        return Promise.resolve();
    });
    receive("SCREENSHOT", function (_a) {
        var _b = _a.requestPayload, height = _b.height, width = _b.width, x = _b.x, y = _b.y, filename = _b.filename, windowId = _b.windowId;
        var printWin = backgroundWindows[windowId];
        if (!printWin)
            return Promise.reject();
        if (!printWin.webContents)
            return Promise.reject();
        return new Promise(function (resolve, reject) {
            var path = path_1.join(electron_1.app.getPath("desktop"), filename + ".png" || "screenshot.png");
            console.log({ path: path, height: height, width: width, x: x, y: y, windowId: windowId });
            printWin.webContents
                .capturePage({ height: height, width: width, x: x, y: y })
                .then(function (image) {
                console.log(image);
                fs.writeFile(path, image.toPNG(), "binary", function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    });
    receive("SEND_ACTION_TO_WINDOW", function (_a) {
        var requestPayload = _a.requestPayload;
        return call(requestPayload.type, requestPayload.payload);
    });
    receive("DESTROY_WINDOW", function (_a) {
        var payload = _a.requestPayload;
        if (backgroundWindows[payload.windowId]) {
            if (backgroundWindows[payload.windowId].destroy) {
                backgroundWindows[payload.windowId].destroy();
            }
            delete backgroundWindows[payload.windowId];
        }
        else {
            return Promise.reject();
        }
        return Promise.resolve();
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.whenReady().then(createWindow);
// Quit when all windows are closed.
electron_1.app.on("window-all-closed", function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
//# sourceMappingURL=main.js.map