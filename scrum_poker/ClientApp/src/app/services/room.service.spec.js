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
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        testing_1.TestBed.configureTestingModule({
                            providers: [room_service_1.RoomService, room_1.Room],
                            imports: [testing_2.RouterTestingModule]
                        });
                        _a = this;
                        return [4 /*yield*/, testing_1.TestBed.get(room_service_1.RoomService)];
                    case 1:
                        _a.roomService = _c.sent();
                        _b = this;
                        return [4 /*yield*/, testing_1.TestBed.get(room_1.Room)];
                    case 2:
                        _b.room = _c.sent();
                        return [4 /*yield*/, this.roomService.createRoom("1,2,3,4,5,6", false)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should be defined and have a mock backend available', function () {
        expect(this.roomService).toBeInstanceOf(room_service_1.RoomService);
        expect(this.roomService.backend).toBeInstanceOf(mock_backend_service_1.MockBackendService);
    });
    it('should enable creating a new room', function () {
        return __awaiter(this, void 0, void 0, function () {
            var isUuid;
            return __generator(this, function (_a) {
                isUuid = validator_1.default.isUUID(this.room.roomId);
                expect(isUuid).toBeTrue();
                // Check if cards were set correctly
                expect(this.room.cards).toEqual(["1", "2", "3", "4", "5", "6"]);
                return [2 /*return*/];
            });
        });
    });
    it('should enable users to join an existing room', function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, isUuid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.roomService.joinRoom("Ronald McDonald", this.room.roomId)];
                    case 1:
                        result = _a.sent();
                        // Check returned result
                        expect(result).toEqual("JOIN_SUCCESSFUL");
                        // Check if room data was set accordingly
                        expect(this.room.you.username).toEqual("Ronald McDonald");
                        isUuid = validator_1.default.isUUID(this.room.you.userId);
                        expect(isUuid).toBeTrue();
                        expect(this.room.you.isAdmin).toBeTrue();
                        expect(this.room.cardsRevealed).toBeFalse();
                        expect(this.room.playedCards).toEqual(0);
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should have an up-to-date list of users after multiple joins and leaves', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.roomService.joinRoom("Ronald McDonald", this.room.roomId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.roomService.joinRoom("Colonel Sanders", this.room.roomId)];
                    case 2:
                        _a.sent();
                        this.roomService.leaveRoom();
                        return [4 /*yield*/, this.roomService.joinRoom("Chuck E. Cheese", this.room.roomId)];
                    case 3:
                        _a.sent();
                        // Check if user list is correct
                        expect(this.room.users.length).toBe(2);
                        expect(this.room.users[0].username).toEqual("Ronald McDonald");
                        expect(this.room.users[0].selectedCard).toEqual(-1);
                        expect(this.room.users[0].isAdmin).toBeTrue();
                        expect(this.room.users[1].username).toEqual("Chuck E. Cheese");
                        expect(this.room.users[1].selectedCard).toEqual(-1);
                        expect(this.room.users[1].isAdmin).toBeFalse();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should allow revealing and resetting the room\'s cards', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.roomService.joinRoom("Ronald McDonald", this.room.roomId)];
                    case 1:
                        _a.sent();
                        this.roomService.revealCards();
                        expect(this.room.cardsRevealed).toBeTrue();
                        this.roomService.resetCards();
                        expect(this.room.cardsRevealed).toBeFalse();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should allow selecting and deselecting cards', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.roomService.joinRoom("Ronald McDonald", this.room.roomId)];
                    case 1:
                        _a.sent();
                        // Select card and change opinion before reveal
                        this.roomService.selectCard(3);
                        expect(this.room.you.selectedCard).toEqual(3);
                        this.roomService.selectCard(5);
                        expect(this.room.you.selectedCard).toEqual(5);
                        expect(this.room.playedCards).toEqual(1);
                        // Check correct reveal/reset behaviour
                        this.roomService.revealCards();
                        this.roomService.resetCards();
                        expect(this.room.you.selectedCard).toEqual(-1);
                        // Check correct deselect behaviour
                        this.roomService.selectCard(2);
                        expect(this.room.you.selectedCard).toEqual(2);
                        expect(this.room.playedCards).toEqual(2);
                        this.roomService.selectCard(2);
                        expect(this.room.you.selectedCard).toEqual(-1);
                        expect(this.room.playedCards).toEqual(1);
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
                    case 0: return [4 /*yield*/, this.roomService.joinRoom("Ronald McDonald", this.room.roomId)];
                    case 1:
                        _a.sent();
                        roomId = this.room.roomId;
                        userId = this.room.you.userId;
                        this.roomService.selectCard(3);
                        this.roomService.revealCards();
                        this.roomService.leaveRoom();
                        // Clear frontend-only data
                        // Needs to be done like this because this.room is a singleton
                        this.room.roomId = null;
                        this.room.cardsRevealed = false;
                        this.room.playedCards = 0;
                        this.room.cards = null;
                        this.room.you = new user_1.User();
                        this.room.users = new Array();
                        // Rejoin room
                        this.room.roomId = roomId;
                        this.room.you.userId = userId;
                        return [4 /*yield*/, this.roomService.rejoinRoom()];
                    case 2:
                        _a.sent();
                        // Check if data is set correctly
                        expect(this.room.you.username).toEqual("Ronald McDonald");
                        expect(this.room.you.selectedCard).toEqual(3);
                        expect(this.room.you.isAdmin).toBeTrue();
                        expect(this.room.cardsRevealed).toBeTrue();
                        expect(this.room.cards).toEqual(["1", "2", "3", "4", "5", "6"]);
                        expect(this.room.playedCards).toEqual(1);
                        return [2 /*return*/];
                }
            });
        });
    });
});
//# sourceMappingURL=room.service.spec.js.map