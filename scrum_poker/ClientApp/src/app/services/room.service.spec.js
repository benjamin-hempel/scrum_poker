"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
var room_service_1 = require("../services/room.service");
describe('RoomService', function () {
    var service;
    beforeEach(function () { service = new room_service_1.RoomService(); });
    it('should be connected to the SignalR hub', function () {
        var hubConnection = service.getHubConnection();
        expect(hubConnection.state).toBe(1);
    });
});
//# sourceMappingURL=room.service.spec.js.map