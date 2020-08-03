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
var testing_1 = require("@angular/core/testing");
var testing_2 = require("@angular/router/testing");
var router_1 = require("@angular/router");
var activated_route_stub_1 = require("../../testing/activated-route-stub");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var ngx_translate_testing_1 = require("ngx-translate-testing");
var angularx_qrcode_1 = require("angularx-qrcode");
var room_component_1 = require("./room.component");
var home_component_1 = require("../home/home.component");
var error_page_component_1 = require("../error-page/error-page.component");
var room_service_1 = require("../../services/room.service");
var room_1 = require("../../models/room");
var validator_1 = require("validator");
var routes_1 = require("../../routes");
describe('RoomComponent', function () {
    var component;
    var fixture;
    var route;
    var roomService;
    var room;
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        route = new activated_route_stub_1.ActivatedRouteStub();
                        testing_1.TestBed.configureTestingModule({
                            declarations: [room_component_1.RoomComponent, home_component_1.HomeComponent, error_page_component_1.ErrorPageComponent],
                            providers: [room_service_1.RoomService, { provide: router_1.ActivatedRoute, useValue: route }],
                            imports: [
                                testing_2.RouterTestingModule.withRoutes(routes_1.routes),
                                angular_fontawesome_1.FontAwesomeModule,
                                angularx_qrcode_1.QRCodeModule,
                                ngx_translate_testing_1.TranslateTestingModule.withTranslations({ en: require('src/assets/i18n/en.json'), de: require('src/assets/i18n/de.json') }).withDefaultLanguage('de')
                            ]
                        })
                            .compileComponents();
                        return [4 /*yield*/, testing_1.TestBed.get(room_service_1.RoomService)];
                    case 1:
                        roomService = _a.sent();
                        return [4 /*yield*/, testing_1.TestBed.get(room_1.Room)];
                    case 2:
                        room = _a.sent();
                        // Recreate joining process
                        return [4 /*yield*/, roomService.createRoom("1,2,3,4,5,6", false)];
                    case 3:
                        // Recreate joining process
                        _a.sent();
                        return [4 /*yield*/, roomService.joinRoom("Chuck E. Cheese")];
                    case 4:
                        _a.sent();
                        route.setParamMap({ 'rid': room.roomId, 'uid': room.you.userId });
                        fixture = testing_1.TestBed.createComponent(room_component_1.RoomComponent);
                        component = fixture.componentInstance;
                        fixture.detectChanges();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('should be defined', function () {
        expect(component).toBeDefined();
    });
    it('should show the correct information after joining', testing_1.async(function () {
        fixture.whenStable().then(function () {
            fixture.detectChanges();
            var roomId = fixture.nativeElement.querySelector('div#divRoomID > p');
            expect(validator_1.default.isUUID(roomId.innerHTML)).toBeTrue();
            var username = fixture.nativeElement.querySelector('div#divOwnUsername > p');
            expect(username.innerHTML).toEqual('Chuck E. Cheese');
            var userCounter = fixture.nativeElement.querySelector('div#divRoomUsers > p');
            expect(userCounter.innerHTML).toEqual('1');
            var cardCounter = fixture.nativeElement.querySelector('div#divPlayedCards > p');
            expect(cardCounter.innerHTML).toEqual('0');
            var joinLink = fixture.nativeElement.querySelector('div#divShareLink > p > a');
            expect(joinLink.innerHTML).toEqual(window.location.protocol + "//" + window.location.host + "/" + room.roomId);
        });
    }));
    it('should correctly indicate a selected card', testing_1.async(function () {
        fixture.whenStable().then(function () {
            fixture.detectChanges();
            var playCardButton = fixture.nativeElement.querySelector('button#playCardButton');
            playCardButton.click();
            fixture.detectChanges();
            var card4 = fixture.nativeElement.querySelector('div#card-4');
            card4.click();
            fixture.detectChanges();
            var userCard = fixture.nativeElement.querySelector('div#otherUsersContainer > div');
            expect(userCard.classList.contains('bg-success')).toBeTrue();
        });
    }));
});
//# sourceMappingURL=room.component.spec.js.map