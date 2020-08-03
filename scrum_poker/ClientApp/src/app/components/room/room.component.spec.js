"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var testing_2 = require("@angular/router/testing");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var ngx_translate_testing_1 = require("ngx-translate-testing");
var angularx_qrcode_1 = require("angularx-qrcode");
var room_component_1 = require("./room.component");
var home_component_1 = require("../home/home.component");
var error_page_component_1 = require("../error-page/error-page.component");
var room_service_1 = require("../../services/room.service");
var room_1 = require("../../models/room");
var routes_1 = require("../../routes");
describe('RoomComponent', function () {
    var component;
    var fixture;
    var roomService;
    var room;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [room_component_1.RoomComponent, home_component_1.HomeComponent, error_page_component_1.ErrorPageComponent],
            providers: [room_service_1.RoomService],
            imports: [
                testing_2.RouterTestingModule.withRoutes(routes_1.routes),
                angular_fontawesome_1.FontAwesomeModule,
                angularx_qrcode_1.QRCodeModule,
                ngx_translate_testing_1.TranslateTestingModule.withTranslations({ en: require('src/assets/i18n/en.json'), de: require('src/assets/i18n/de.json') }).withDefaultLanguage('de')
            ]
        })
            .compileComponents();
        roomService = testing_1.TestBed.get(room_service_1.RoomService);
        room = testing_1.TestBed.get(room_1.Room);
        roomService.createRoom("1,2,3,4,5,6", false);
        roomService.joinRoom("Chuck E. Cheese");
        fixture = testing_1.TestBed.createComponent(room_component_1.RoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    it('should be defined', function () {
        expect(component).toBeDefined();
    });
});
//# sourceMappingURL=room.component.spec.js.map