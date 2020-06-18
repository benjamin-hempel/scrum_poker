"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var MockRoom = /** @class */ (function () {
    function MockRoom(cardDeck, allUsersAreAdmins) {
        if (allUsersAreAdmins === void 0) { allUsersAreAdmins = false; }
        this.id = uuid_1.v4();
        this.users = new Array();
        this.cardsRevealed = false;
        this.allUsersAreAdmins = allUsersAreAdmins;
        this.cardDeck = cardDeck;
    }
    return MockRoom;
}());
exports.MockRoom = MockRoom;
//# sourceMappingURL=mock-room.js.map