"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var room_service_1 = require("../services/room.service");
describe('RoomService', function () {
    var roomService;
    testing_1.TestBed.configureTestingModule({
        providers: [room_service_1.RoomService]
    });
    beforeEach(function () {
        roomService = testing_1.TestBed.get(room_service_1.RoomService);
    });
    it('should be connected to the SignalR hub', function () {
        expect(roomService.backend).toBeDefined();
    });
});
//# sourceMappingURL=room.service.spec.js.map