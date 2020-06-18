"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var room_callbacks_1 = require("../room-callbacks");
var room_1 = require("../../models/room");
var MockBackendService /*implements BackendInterface*/ = /** @class */ (function () {
    function MockBackendService(room) {
        this.rooms = new Array();
        this.callbacks = new room_callbacks_1.RoomCallbacks(room);
    }
    MockBackendService.prototype.createRoom = function (cardDeck, allUsersAreAdmins) {
        var newRoom = new room_1.Room();
        /*newRoom.roomId =*/
    };
    return MockBackendService;
}());
exports.MockBackendService = MockBackendService;
//# sourceMappingURL=mock-backend.service.js.map