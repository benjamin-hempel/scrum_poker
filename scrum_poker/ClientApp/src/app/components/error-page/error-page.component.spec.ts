import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { ErrorPageComponent } from './error-page.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorPageComponent],
      imports: [
        RouterTestingModule,
        FontAwesomeModule,
        TranslateTestingModule.withTranslations({ en: require('src/assets/i18n/en.json'), de: require('src/assets/i18n/de.json') }).withDefaultLanguage('de')
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should show the appropriate message if the server is unavailable', () => {
    component.errorMessage = "service-unavailable";
    fixture.detectChanges();

    const errorMessage: HTMLElement = fixture.nativeElement.querySelector('p#errorMessage');
    expect(errorMessage.textContent).toEqual("Der Server ist zur Zeit nicht erreichbar. Bitte versuche es später erneut.");
  });

  it('should show a generic error message if no cause was specified', () => {
    const errorMessage: HTMLElement = fixture.nativeElement.querySelector('p#errorMessage');
    expect(errorMessage.textContent).toEqual("Bitte versuche es später erneut.");
  });
});
