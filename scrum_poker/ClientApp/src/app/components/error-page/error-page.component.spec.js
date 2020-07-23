"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var testing_2 = require("@angular/router/testing");
var error_page_component_1 = require("./error-page.component");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var ngx_translate_testing_1 = require("ngx-translate-testing");
describe('BannerComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [error_page_component_1.ErrorPageComponent],
            imports: [
                testing_2.RouterTestingModule,
                angular_fontawesome_1.FontAwesomeModule,
                ngx_translate_testing_1.TranslateTestingModule.withTranslations({ en: require('src/assets/i18n/en.json'), de: require('src/assets/i18n/de.json') }).withDefaultLanguage('de')
            ]
        })
            .compileComponents();
        fixture = testing_1.TestBed.createComponent(error_page_component_1.ErrorPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    it('should create', function () {
        expect(component).toBeDefined();
    });
});
//# sourceMappingURL=error-page.component.spec.js.map