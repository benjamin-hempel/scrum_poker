"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user");
var Room = /** @class */ (function () {
    function Room() {
        this.cardsRevealed = false;
        this.playedCards = 0;
        this.you = new user_1.User();
        this.users = new Array();
    }
    Room.prototype.addUser = function (userId, username, isAdmin, selectedCard) {
        if (selectedCard === void 0) { selectedCard = -1; }
        var newUser = new user_1.User();
        newUser.userId = userId;
        newUser.username = username;
        newUser.selectedCard = selectedCard;
        newUser.isAdmin = isAdmin;
        this.users.push(newUser);
    };
    Room.prototype.removeUser = function (userId) {
        var index = this.users.findIndex(function (user) { return user.userId == userId; });
        this.users.splice(index, 1);
    };
    Room.prototype.getUserById = function (userId) {
        return this.users.find(function (user) { return user.userId == userId; });
    };
    return Room;
}());
exports.Room = Room;
//# sourceMappingURL=room.js.map