"use strict";
exports.__esModule = true;
exports.SocketEvent = void 0;
var SocketEvent;
(function (SocketEvent) {
    // ---- Connection ----
    SocketEvent["CONNECT"] = "connection";
    SocketEvent["DISCONNECT"] = "disconnect";
    // ---- User ----
    SocketEvent["USERS_SYNC"] = "users:sync";
    SocketEvent["USERS_ONLINE"] = "users:online";
    SocketEvent["USER_STATUS"] = "user:status";
    // ---- Chat ----
    SocketEvent["CHAT_SEND"] = "chat:send";
    SocketEvent["CHAT_RECEIVE"] = "chat:receive";
    SocketEvent["CHAT_READ"] = "chat:read";
    SocketEvent["CHAT_SUCCESS"] = "chat:success";
    SocketEvent["CHAT_ERROR"] = "chat:error";
    // ---- Call Core ----
    SocketEvent["CALL_INITIATE"] = "call:initiate";
    SocketEvent["CALL_INCOMING"] = "call:incoming";
    SocketEvent["CALL_INITIATED"] = "call:initiated";
    SocketEvent["CALL_ANSWER"] = "call:answer";
    SocketEvent["CALL_ANSWERED"] = "call:answered";
    SocketEvent["CALL_REJECT"] = "call:reject";
    SocketEvent["CALL_END"] = "call:end";
    SocketEvent["CALL_SUCCESS"] = "call:success";
    SocketEvent["CALL_ERROR"] = "call:error";
    // ---- WebRTC ----
    SocketEvent["WEBRTC_OFFER"] = "webrtc:offer";
    SocketEvent["WEBRTC_ANSWER"] = "webrtc:answer";
    SocketEvent["WEBRTC_ICE"] = "webrtc:ice-candidate";
    SocketEvent["WEBRTC_ERROR"] = "webrtc:error";
})(SocketEvent = exports.SocketEvent || (exports.SocketEvent = {}));
