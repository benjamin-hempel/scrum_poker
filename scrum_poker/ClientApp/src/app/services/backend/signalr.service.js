"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var signalR = require("@aspnet/signalr");
var SignalRService /*implements BackendInterface*/ = /** @class */ (function () {
    function SignalRService(room) {
        this.room = room;
        this.createConnection();
    }
    SignalRService.prototype.createConnection = function () {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(window.location.protocol + "//" + window.location.host + "/roomHub")
            .build();
    };
    SignalRService.prototype.registerCallbacks = function () {
    };
    return SignalRService;
}());
exports.SignalRService = SignalRService;
//# sourceMappingURL=signalr.service.js.map