"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var uuid_1 = require("uuid");
var callsAwaitingResponse = {};
var receiveCallbacks = {};
function setUpListener(on, send) {
    if (!on)
        return;
    on("MESSAGE", function (event, args) {
        var message = JSON.parse(args);
        console.log("RECEIVE MESSAGE", message);
        if (message.messageType === "RESPONSE") {
            Object.keys(callsAwaitingResponse).forEach(function (actionId) {
                if (message.actionId !== actionId)
                    return;
                var callback = callsAwaitingResponse[actionId];
                var shouldDelete = callback(message);
                if (shouldDelete)
                    delete callsAwaitingResponse[actionId];
            });
        }
        else {
            Object.keys(receiveCallbacks).forEach(function (type) {
                if (type !== message.type)
                    return;
                if (!receiveCallbacks[type])
                    return;
                Object.values(receiveCallbacks[type]).forEach(function (callback) {
                    callback(message)
                        .then(function (responsePayload) { return (__assign(__assign({}, message), { status: "SUCCESS", responsePayload: responsePayload, messageType: "RESPONSE" })); })["catch"](function (error) { return (__assign(__assign({}, message), { status: "ERROR", error: error, messageType: "RESPONSE" })); })
                        .then(function (responseMessage) {
                        var reply = event.reply || send;
                        if (!reply)
                            throw new Error("Could not reply");
                        console.log("REPLY MESSAGE", responseMessage);
                        reply("MESSAGE", JSON.stringify(responseMessage));
                    });
                });
            });
        }
    });
}
exports.setUpListener = setUpListener;
function response(message, callback) {
    callsAwaitingResponse[message.actionId] = callback;
}
exports.getCall = function (send) {
    return function call(type, payload) {
        if (!send)
            return Promise.reject(new Error("No ipcRenderer"));
        var actionId = uuid_1.v4();
        var message = {
            actionId: actionId,
            type: type,
            messageType: "REQUEST",
            requestPayload: payload
        };
        var promise = new Promise(function (resolve, reject) {
            response(message, function (responseMessage) {
                if (responseMessage.type !== type)
                    return false;
                if (responseMessage.messageType !== "RESPONSE")
                    return false;
                if (responseMessage.actionId !== actionId)
                    return false;
                if (responseMessage.status === "SUCCESS") {
                    resolve(responseMessage.responsePayload);
                }
                else {
                    reject(responseMessage.error);
                }
                return true;
            });
            console.log("SEND MESSAGE", message);
            send("MESSAGE", JSON.stringify(message));
        });
        return promise;
    };
};
exports.getReceive = function () {
    return function receive(type, callback) {
        var id = uuid_1.v4();
        if (!receiveCallbacks[type])
            receiveCallbacks[type] = {};
        receiveCallbacks[type][id] = callback;
        return function () {
            if (!receiveCallbacks[type])
                return;
            delete receiveCallbacks[type][id];
        };
    };
};
//# sourceMappingURL=callAndReceive.js.map