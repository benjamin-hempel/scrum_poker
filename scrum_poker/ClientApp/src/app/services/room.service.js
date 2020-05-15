"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var signalR = require("@aspnet/signalr");
var RoomService = /** @class */ (function () {
    function RoomService() {
        this.createConnection();
        this.startConnection();
    }
    RoomService.prototype.createConnection = function () {
        this._hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:44317/roomHub")
            .build();
    };
    RoomService.prototype.registerCallbacks = function () {
        this._hubConnection.on("UserJoined", function (userId, username) {
        });
        this._hubConnection.on("UserLeft", function (userId) {
        });
        this._hubConnection.on("CardSelected", function (userId, cardSelected) {
        });
        this._hubConnection.on("CardRevealed", function (userId, selectedCard) {
        });
        this._hubConnection.on("CardsReset", function () {
        });
    };
    RoomService.prototype.startConnection = function () {
        this._hubConnection
            .start()
            .then(function () { return console.log("Established connection to SignalR hub."); })
            .catch(function (err) { return console.log("Failed to establish connection to SignalR hub: " + err); });
    };
    RoomService.prototype.createRoom = function () {
        this._hubConnection.invoke("CreateRoom");
    };
    RoomService.prototype.joinRoom = function (roomId, username) {
        return this._hubConnection.invoke("JoinRoom", roomId, username);
    };
    RoomService.prototype.leaveRoom = function (roomId, userId) {
        this._hubConnection.invoke("LeaveRoom", roomId, userId);
    };
    RoomService.prototype.selectCard = function (roomId, userId, selectedCard) {
        this._hubConnection.invoke("SelectCard", roomId, userId, selectedCard);
    };
    RoomService.prototype.revealCards = function (roomId) {
        this._hubConnection.invoke("RevealCards", roomId);
    };
    RoomService.prototype.resetCards = function (roomId) {
        this._hubConnection.invoke("ResetCards", roomId);
    };
    return RoomService;
}());
exports.RoomService = RoomService;
//# sourceMappingURL=roomService.js.map