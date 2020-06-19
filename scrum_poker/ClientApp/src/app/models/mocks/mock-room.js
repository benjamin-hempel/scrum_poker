"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var mock_user_1 = require("./mock-user");
/* This is the TypeScript equivalent of the backend's Room class, sans connection management */
var MockRoom = /** @class */ (function () {
    function MockRoom(cardDeck, allUsersAreAdmins) {
        if (allUsersAreAdmins === void 0) { allUsersAreAdmins = false; }
        this.id = uuid_1.v4();
        this.users = new Array();
        this.cardsRevealed = false;
        this.allUsersAreAdmins = allUsersAreAdmins;
        this.cardDeck = cardDeck;
    }
    MockRoom.prototype.addUser = function (username, connectionId) {
        var newUser;
        if (this.users.length == 0 || this.allUsersAreAdmins == true)
            newUser = new mock_user_1.MockUser(username, true);
        else
            newUser = new mock_user_1.MockUser(username);
        this.users.push(newUser);
        return newUser;
    };
    MockRoom.prototype.removeUser = function (userId) {
        var userToRemove = this.users.findIndex(function (x) { return x.id == userId; });
        this.users.splice(userToRemove, 1);
    };
    MockRoom.prototype.getUser = function (userId) {
        return this.users.find(function (x) { return x.id == userId; });
    };
    MockRoom.prototype.getActiveUsers = function () {
        return this.users.filter(function (x) { return !x.missingInAction; });
    };
    MockRoom.prototype.getAllUSers = function () {
        return this.users;
    };
    return MockRoom;
}());
exports.MockRoom = MockRoom;
//# sourceMappingURL=mock-room.js.map