"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var testing_2 = require("@angular/router/testing");
var home_component_1 = require("./home.component");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var ngx_translate_testing_1 = require("ngx-translate-testing");
describe('HomeComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [home_component_1.HomeComponent],
            imports: [
                testing_2.RouterTestingModule,
                angular_fontawesome_1.FontAwesomeModule,
                ngx_translate_testing_1.TranslateTestingModule.withTranslations({ en: require('src/assets/i18n/en.json'), de: require('src/assets/i18n/de.json') }).withDefaultLanguage('de')
            ]
        })
            .compileComponents();
        fixture = testing_1.TestBed.createComponent(home_component_1.HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    it('should be defined', function () {
        expect(component).toBeDefined();
    });
    it('should show an error message when no username was specified', testing_1.async(function () {
        var createRoomButton = fixture.nativeElement.querySelector('button#createRoom');
        createRoomButton.click();
        fixture.whenStable().then(function () {
            fixture.detectChanges();
            var errorMessage = fixture.nativeElement.querySelector('div#noUsernameWarning');
            expect(errorMessage).toBeDefined();
            expect(errorMessage.textContent).toBe(" Du musst einen Benutzernamen angeben. ");
        });
    }));
    it('should show an error message when trying to join a non-existing room', testing_1.async(function () {
        var roomIdInput = fixture.nativeElement.querySelector('input#roomID');
        roomIdInput.value = 'room1';
        roomIdInput.dispatchEvent(new Event('input'));
        var usernameInput = fixture.nativeElement.querySelector('input#username');
        usernameInput.value = "Jim Hopper";
        usernameInput.dispatchEvent(new Event('input'));
        var joinRoomButton = fixture.nativeElement.querySelector('button#joinRoom');
        joinRoomButton.click();
        fixture.whenStable().then(function () {
            fixture.detectChanges();
            var errorMessage = fixture.nativeElement.querySelector('div#roomExistsWarning');
            expect(errorMessage).toBeDefined();
            expect(errorMessage.textContent).toBe(" Der angegebene Raum existiert nicht. ");
        });
    }));
    it('should show an error message when not entering a room ID before trying to join', testing_1.async(function () {
        var usernameInput = fixture.nativeElement.querySelector('input#username');
        usernameInput.value = "Jim Hopper";
        usernameInput.dispatchEvent(new Event('input'));
        var joinRoomButton = fixture.nativeElement.querySelector('button#joinRoom');
        joinRoomButton.click();
        fixture.whenStable().then(function () {
            fixture.detectChanges();
            var errorMessage = fixture.nativeElement.querySelector('div#noRoomIdWarning');
            expect(errorMessage).toBeDefined();
            expect(errorMessage.textContent).toBe(" Du musst eine Raum-ID angeben. ");
        });
    }));
    it('should create a room and navigate to it if a username was specified', testing_1.async(function () {
        var usernameInput = fixture.nativeElement.querySelector('input#username');
        usernameInput.value = "Jim Hopper";
        usernameInput.dispatchEvent(new Event('input'));
        var createRoomButton = fixture.nativeElement.querySelector('button#createRoom');
        createRoomButton.click();
        fixture.whenStable().then(function () {
            /* TODO */
        });
    }));
});
//# sourceMappingURL=home.component.spec.js.map