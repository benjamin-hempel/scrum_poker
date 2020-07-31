"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var validator_1 = require("validator");
var testing_1 = require("@angular/core/testing");
var room_service_1 = require("../services/room.service");
var room_1 = require("../models/room");
var user_1 = require("../models/user");
var testing_2 = require("@angular/router/testing");
var mock_backend_service_1 = require("./backend/mock-backend.service");
describe('RoomService', function () {
    var roomService;
    var room;
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testing_1.TestBed.configureTestingModule({
                            providers: [room_service_1.RoomService, room_1.Room],
                            imports: [testing_2.RouterTestingModule]
                        });
                        return [4 /*yield*/, testing_1.TestBed.get(room_service_1.RoomService)];
                    case 1:
                        roomService = _a.sent();
                        return [4 /*yield*/, testing_1.TestBed.get(room_1.Room)];
                    case 2:
                        room = _a.sent();
                        return [4 /*yield*/, roomService.createRoom("1,2,3,4,5,6", false)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should be defined and have a mock backend available', function () {
        expect(roomService).toBeInstanceOf(room_service_1.RoomService);
        expect(roomService.backend).toBeInstanceOf(mock_backend_service_1.MockBackendService);
    });
    it('should enable creating a new room', function () {
        return __awaiter(this, void 0, void 0, function () {
            var isUuid;
            return __generator(this, function (_a) {
                isUuid = validator_1.default.isUUID(room.roomId);
                expect(isUuid).toBeTrue();
                // Check if cards were set correctly
                expect(room.cards).toEqual(["1", "2", "3", "4", "5", "6"]);
                return [2 /*return*/];
            });
        });
    });
    it('should enable users to join an existing room', function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, isUuid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, roomService.joinRoom("Ronald McDonald", room.roomId)];
                    case 1:
                        result = _a.sent();
                        // Check returned result
                        expect(result).toEqual("JOIN_SUCCESSFUL");
                        // Check if room data was set accordingly
                        expect(room.you.username).toEqual("Ronald McDonald");
                        isUuid = validator_1.default.isUUID(room.you.userId);
                        expect(isUuid).toBeTrue();
                        expect(room.you.isAdmin).toBeTrue();
                        expect(room.cardsRevealed).toBeFalse();
                        expect(room.playedCards).toEqual(0);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should have an up-to-date list of users after multiple joins and leaves', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, roomService.joinRoom("Ronald McDonald", room.roomId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, roomService.joinRoom("Colonel Sanders", room.roomId)];
                    case 2:
                        _a.sent();
                        roomService.leaveRoom();
                        return [4 /*yield*/, roomService.joinRoom("Chuck E. Cheese", room.roomId)];
                    case 3:
                        _a.sent();
                        // Check if user list is correct
                        expect(room.users.length).toBe(2);
                        expect(room.users[0].username).toEqual("Ronald McDonald");
                        expect(room.users[0].selectedCard).toEqual(-1);
                        expect(room.users[0].isAdmin).toBeTrue();
                        expect(room.users[1].username).toEqual("Chuck E. Cheese");
                        expect(room.users[1].selectedCard).toEqual(-1);
                        expect(room.users[1].isAdmin).toBeFalse();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should allow revealing and resetting the room\'s cards', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, roomService.joinRoom("Ronald McDonald", room.roomId)];
                    case 1:
                        _a.sent();
                        roomService.revealCards();
                        expect(room.cardsRevealed).toBeTrue();
                        roomService.resetCards();
                        expect(room.cardsRevealed).toBeFalse();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should allow selecting and deselecting cards', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, roomService.joinRoom("Ronald McDonald", room.roomId)];
                    case 1:
                        _a.sent();
                        // Select card and change opinion before reveal
                        roomService.selectCard(3);
                        expect(room.you.selectedCard).toEqual(3);
                        roomService.selectCard(5);
                        expect(room.you.selectedCard).toEqual(5);
                        expect(room.playedCards).toEqual(1);
                        // Check correct reveal/reset behaviour
                        roomService.revealCards();
                        roomService.resetCards();
                        expect(room.you.selectedCard).toEqual(-1);
                        // Check correct deselect behaviour
                        roomService.selectCard(2);
                        expect(room.you.selectedCard).toEqual(2);
                        expect(room.playedCards).toEqual(2);
                        roomService.selectCard(2);
                        expect(room.you.selectedCard).toEqual(-1);
                        expect(room.playedCards).toEqual(1);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should allow rejoining a room given correct room and user IDs', function () {
        return __awaiter(this, void 0, void 0, function () {
            var roomId, userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, roomService.joinRoom("Ronald McDonald", room.roomId)];
                    case 1:
                        _a.sent();
                        roomId = room.roomId;
                        userId = room.you.userId;
                        roomService.selectCard(3);
                        roomService.revealCards();
                        roomService.leaveRoom();
                        // Clear frontend-only data
                        // Needs to be done like this because room is a singleton
                        room.roomId = null;
                        room.cardsRevealed = false;
                        room.playedCards = 0;
                        room.cards = null;
                        room.you = new user_1.User();
                        room.users = new Array();
                        // Rejoin room
                        room.roomId = roomId;
                        room.you.userId = userId;
                        return [4 /*yield*/, roomService.rejoinRoom()];
                    case 2:
                        _a.sent();
                        // Check if data is set correctly
                        expect(room.you.username).toEqual("Ronald McDonald");
                        expect(room.you.selectedCard).toEqual(3);
                        expect(room.you.isAdmin).toBeTrue();
                        expect(room.cardsRevealed).toBeTrue();
                        expect(room.cardsRevealed).toBeTrue();
                        expect(room.cards).toEqual(["1", "2", "3", "4", "5", "6"]);
                        expect(room.playedCards).toEqual(1);
                        return [2 /*return*/];
                }
            });
        });
    });
});
//# sourceMappingURL=room.service.spec.js.map