import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { QRCodeModule } from 'angularx-qrcode';

import { RoomComponent } from './room.component';
import { HomeComponent } from '../home/home.component';
import { ErrorPageComponent } from '../error-page/error-page.component';

import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';

import { routes } from '../../routes';


describe('RoomComponent', () => {
  let component: RoomComponent;
  let fixture: ComponentFixture<RoomComponent>;
  let roomService: RoomService;
  let room: Room;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RoomComponent, HomeComponent, ErrorPageComponent],
      providers: [RoomService],
      imports: [
        RouterTestingModule.withRoutes(routes),
        FontAwesomeModule,
        QRCodeModule,
        TranslateTestingModule.withTranslations({ en: require('src/assets/i18n/en.json'), de: require('src/assets/i18n/de.json') }).withDefaultLanguage('de')
      ]
    })
    .compileComponents();

    roomService = TestBed.get(RoomService);
    room = TestBed.get(Room);

    roomService.createRoom("1,2,3,4,5,6", false);
    roomService.joinRoom("Chuck E. Cheese");

    fixture = TestBed.createComponent(RoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
