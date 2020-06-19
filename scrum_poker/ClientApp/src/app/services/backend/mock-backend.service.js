"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var room_callbacks_1 = require("../room-callbacks");
var mock_room_1 = require("../../models/mocks/mock-room");
/* This allows frontend testing without the backend running. */
var MockBackendService = /** @class */ (function () {
    function MockBackendService(room) {
        this.callbacks = new room_callbacks_1.RoomCallbacks(room);
        this.rooms = new Array();
    }
    MockBackendService.prototype.createRoom = function (cardDeck, allUsersAreAdmins) {
        var newRoom = new mock_room_1.MockRoom(cardDeck, allUsersAreAdmins);
        this.rooms.push(newRoom);
        return newRoom.id;
    };
    MockBackendService.prototype.joinRoom = function (username, roomId) {
        var room = this.rooms.find(function (x) { return x.id == roomId; });
        if (room == null)
            return "ROOM_DOES_NOT_EXIST";
        var user = room.addUser(username);
        this.callbacks.UserJoinedCallback(user.id, user.name, user.isAdmin);
        var obj = ({ Id: user.id, IsAdmin: user.isAdmin, CardDeck: room.cardDeck, CardsRevealed: room.cardsRevealed, PlayedCards: room.playedCards });
        return JSON.stringify(obj);
    };
    MockBackendService.prototype.leaveRoom = function (roomId, userId) {
        var room = this.rooms.find(function (x) { return x.id == roomId; });
        if (room == null)
            return;
        var user = room.getUser(userId);
        if (user == null)
            return;
        /* Please note that data is not persistent across page reloads */
        user.missingInAction = true;
        window.setTimeout(this.removeUserFromRoom, 30000, room, user);
        if (room.getActiveUsers().length == 0)
            window.setTimeout(this.removeRoom, 30000, room);
        this.callbacks.UserLeftCallback(userId);
    };
    MockBackendService.prototype.rejoinRoom = function (roomId, userId) {
        var room = this.rooms.find(function (x) { return x.id == roomId; });
        if (room == null)
            return "ROOM_DOES_NOT_EXIST";
        var user = room.getUser(userId);
        if (user == null)
            return "USER_DOES_NOT_EXIST";
        user.missingInAction = false;
        this.callbacks.UserJoinedCallback(user.id, user.name, user.isAdmin);
        if (user.selectedCard > -1)
            this.callbacks.CardSelectedCallback(user.id, user.selectedCard);
        var obj = ({ Name: user.name, SelectedCard: user.selectedCard, CardsRevealed: room.cardsRevealed, IsAdmin: user.isAdmin, CardDeck: room.cardDeck, PlayedCards: room.playedCards });
        return JSON.stringify(obj);
    };
    MockBackendService.prototype.selectCard = function (roomId, userId, selectedCard) {
        var room = this.rooms.find(function (x) { return x.id == roomId; });
        if (room == null)
            return;
        var user = room.getUser(userId);
        if (user == null)
            return;
        if (user.selectedCard == -1)
            room.playedCards++;
        if (selectedCard == -1)
            room.playedCards--;
        user.selectedCard = selectedCard;
        this.callbacks.CardSelectedCallback(userId, user.selectedCard, room.playedCards);
    };
    MockBackendService.prototype.revealCards = function (roomId) {
        var room = this.rooms.find(function (x) { return x.id == roomId; });
        if (room == null)
            return;
        room.cardsRevealed = true;
        this.callbacks.CardsRevealedCallback();
    };
    MockBackendService.prototype.resetCards = function (roomId) {
        var room = this.rooms.find(function (x) { return x.id == roomId; });
        if (room == null)
            return;
        room.getAllUsers().forEach(function (user) {
            user.selectedCard = -1;
        });
        room.cardsRevealed = false;
        this.callbacks.CardsResetCallback();
    };
    MockBackendService.prototype.getUsers = function (roomId) {
        var room = this.rooms.find(function (x) { return x.id == roomId; });
        if (room == null)
            return "ROOM_DOES_NOT_EXIST";
        var users = room.getActiveUsers();
        return JSON.stringify(users);
    };
    MockBackendService.prototype.removeUserFromRoom = function (room, user) {
        if (user.missingInAction == true)
            room.removeUser(user.id);
    };
    MockBackendService.prototype.removeRoom = function (room) {
        if (room.getActiveUsers().length == 0) {
            var index = this.rooms.findIndex(function (x) { return x.id == room.id; });
            this.rooms.splice(index, 1);
        }
    };
    return MockBackendService;
}());
exports.MockBackendService = MockBackendService;
//# sourceMappingURL=mock-backend.service.js.map