import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Location } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { QRCodeModule } from 'angularx-qrcode';

import { HomeComponent } from './home.component';
import { RoomComponent } from '../room/room.component';
import { ErrorPageComponent } from '../error-page/error-page.component';

import validator from 'validator';
import { routes } from '../../routes';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent, RoomComponent, ErrorPageComponent],
      imports: [
        RouterTestingModule.withRoutes(routes),
        FontAwesomeModule,
        QRCodeModule,
        TranslateTestingModule.withTranslations({ en: require('src/assets/i18n/en.json'), de: require('src/assets/i18n/de.json') }).withDefaultLanguage('de')       
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should show an error message when no username was specified', async(() => {
    const createRoomButton: HTMLButtonElement = fixture.nativeElement.querySelector('button#createRoom');
    createRoomButton.click();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const errorMessage: HTMLElement = fixture.nativeElement.querySelector('div#noUsernameWarning');
      expect(errorMessage).toBeDefined();
      expect(errorMessage.textContent).toBe(" Du musst einen Benutzernamen angeben. ");
    });
  }));

  it('should show an error message when trying to join a non-existing room', async(() => {
    const roomIdInput: HTMLInputElement = fixture.nativeElement.querySelector('input#roomID');
    roomIdInput.value = 'room1';
    roomIdInput.dispatchEvent(new Event('input'));

    const usernameInput: HTMLInputElement = fixture.nativeElement.querySelector('input#username');
    usernameInput.value = "Jim Hopper";
    usernameInput.dispatchEvent(new Event('input'));

    const joinRoomButton: HTMLButtonElement = fixture.nativeElement.querySelector('button#joinRoom');
    joinRoomButton.click();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const errorMessage: HTMLElement = fixture.nativeElement.querySelector('div#roomExistsWarning');
      expect(errorMessage).toBeDefined();
      expect(errorMessage.textContent).toBe(" Der angegebene Raum existiert nicht. ");
    });
  }));

  it('should show an error message when not entering a room ID before trying to join', async(() => {
    const usernameInput: HTMLInputElement = fixture.nativeElement.querySelector('input#username');
    usernameInput.value = "Jim Hopper";
    usernameInput.dispatchEvent(new Event('input'));

    const joinRoomButton: HTMLButtonElement = fixture.nativeElement.querySelector('button#joinRoom');
    joinRoomButton.click();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const errorMessage: HTMLElement = fixture.nativeElement.querySelector('div#noRoomIdWarning');
      expect(errorMessage).toBeDefined();
      expect(errorMessage.textContent).toBe(" Du musst eine Raum-ID angeben. ");
    }); 
  }));

  it('should create a room and navigate to it if a username was specified', async(() => {
    const usernameInput: HTMLInputElement = fixture.nativeElement.querySelector('input#username');
    usernameInput.value = "Jim Hopper";
    usernameInput.dispatchEvent(new Event('input'));

    const createRoomButton: HTMLButtonElement = fixture.nativeElement.querySelector('button#createRoom');
    createRoomButton.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let location: Location = TestBed.get(Location);
      let path = location.path();
      let tokens = path.replace(/=/g, ";").split(";");

      let page = tokens[0];
      expect(page).toEqual("/room");
      let roomId = tokens[2];
      expect(validator.isUUID(roomId)).toBeTrue();
      let userId = tokens[4];
      expect(validator.isUUID(userId)).toBeTrue();
    });
  }));
});
