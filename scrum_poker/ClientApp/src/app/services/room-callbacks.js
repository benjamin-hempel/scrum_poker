"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RoomCallbacks = /** @class */ (function () {
    function RoomCallbacks(room) {
        this.room = room;
    }
    RoomCallbacks.prototype.UserJoinedCallback = function (userId, username, isAdmin) {
        this.room.addUser(userId, username, isAdmin);
    };
    RoomCallbacks.prototype.UserLeftCallback = function (userId) {
        this.room.removeUser(userId);
    };
    RoomCallbacks.prototype.CardSelectedCallback = function (userId, selectedCard, playedCards) {
        var user = this.room.getUserById(userId);
        user.selectedCard = selectedCard;
        if (playedCards != null)
            this.room.playedCards = playedCards;
    };
    RoomCallbacks.prototype.CardsRevealedCallback = function () {
        this.room.cardsRevealed = true;
    };
    RoomCallbacks.prototype.CardsResetCallback = function () {
        this.room.you.selectedCard = -1;
        this.room.cardsRevealed = false;
        for (var _i = 0, _a = this.room.users; _i < _a.length; _i++) {
            var user = _a[_i];
            user.selectedCard = -1;
        }
    };
    return RoomCallbacks;
}());
exports.RoomCallbacks = RoomCallbacks;
//# sourceMappingURL=room-callbacks.js.map