"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var room_service_1 = require("../services/room.service");
var testing_2 = require("@angular/router/testing");
var mock_backend_service_1 = require("./backend/mock-backend.service");
describe('RoomService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [room_service_1.RoomService, mock_backend_service_1.MockBackendService],
            imports: [testing_2.RouterTestingModule]
        });
    });
    it('should be defined', function () {
        var roomService = testing_1.TestBed.get(room_service_1.RoomService);
        expect(roomService).toBeInstanceOf(room_service_1.RoomService);
        expect(roomService.backend).toBeInstanceOf(mock_backend_service_1.MockBackendService);
    });
});
//# sourceMappingURL=room.service.spec.js.map