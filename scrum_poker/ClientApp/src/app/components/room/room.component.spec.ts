import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { ActivatedRoute } from "@angular/router";
import { ActivatedRouteStub } from '../../testing/activated-route-stub';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { QRCodeModule } from 'angularx-qrcode';

import { RoomComponent } from './room.component';
import { HomeComponent } from '../home/home.component';
import { ErrorPageComponent } from '../error-page/error-page.component';

import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';

import validator from 'validator';
import { routes } from '../../routes';



describe('RoomComponent', () => {
  let component: RoomComponent;
  let fixture: ComponentFixture<RoomComponent>;
  let route: ActivatedRouteStub;

  let roomService: RoomService;
  let room: Room;

  beforeEach(async function() {
    route = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      declarations: [RoomComponent, HomeComponent, ErrorPageComponent],
      providers: [RoomService, { provide: ActivatedRoute, useValue: route}],
      imports: [
        RouterTestingModule.withRoutes(routes),
        FontAwesomeModule,
        QRCodeModule,
        TranslateTestingModule.withTranslations({ en: require('src/assets/i18n/en.json'), de: require('src/assets/i18n/de.json') }).withDefaultLanguage('de')
      ]
    })
    .compileComponents();

    roomService = await TestBed.get(RoomService);
    room = await TestBed.get(Room);

    // Recreate joining process
    await roomService.createRoom("1,2,3,4,5,6", false);
    await roomService.joinRoom("Chuck E. Cheese");
    route.setParamMap({ 'rid': room.roomId, 'uid': room.you.userId });
    
    fixture = TestBed.createComponent(RoomComponent);
    
    component = fixture.componentInstance;
    fixture.detectChanges();
    
  });
  
  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should show the correct information after joining', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const roomId: HTMLElement = fixture.nativeElement.querySelector('div#divRoomID > p');
      expect(validator.isUUID(roomId.innerHTML)).toBeTrue();
      const username: HTMLElement = fixture.nativeElement.querySelector('div#divOwnUsername > p');
      expect(username.innerHTML).toEqual('Chuck E. Cheese');
      const userCounter: HTMLElement = fixture.nativeElement.querySelector('div#divRoomUsers > p');
      expect(userCounter.innerHTML).toEqual('1');
      const cardCounter: HTMLElement = fixture.nativeElement.querySelector('div#divPlayedCards > p');
      expect(cardCounter.innerHTML).toEqual('0');
      const joinLink: HTMLElement = fixture.nativeElement.querySelector('div#divShareLink > p > a');
      expect(joinLink.innerHTML).toEqual(window.location.protocol + "//" + window.location.host + "/" + room.roomId);
    });
  }));

  it('should indicate a selected card correctly', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const playCardButton: HTMLButtonElement = fixture.nativeElement.querySelector('button#playCardButton');
      playCardButton.click();
      fixture.detectChanges();
      const card4: HTMLElement = fixture.nativeElement.querySelector('div#card-4');
      card4.click();
      fixture.detectChanges();
      const card4Title: HTMLElement = fixture.nativeElement.querySelector('div#card-4 > div > h3');
      expect(card4Title.classList.contains('selected')).toBeTrue();
      const userCard: HTMLElement = fixture.nativeElement.querySelector('div#otherUsersContainer > .card');
      expect(userCard.classList.contains('bg-success')).toBeTrue();
    });
  }));

  it('should show the selected card correctly when cards are revealed', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const playCardButton: HTMLButtonElement = fixture.nativeElement.querySelector('button#playCardButton');
      playCardButton.click();
      fixture.detectChanges();
      const card4: HTMLElement = fixture.nativeElement.querySelector('div#card-4');
      card4.click();
      fixture.detectChanges();
      const revealCardsButton: HTMLButtonElement = fixture.nativeElement.querySelector('button#revealCardsButton');
      revealCardsButton.click();
      fixture.detectChanges();
      const userCard: HTMLElement = fixture.nativeElement.querySelector('div#otherUsersContainer > .card > .card-body > .card-text');
      expect(userCard.innerHTML).toEqual("5");
    });
  }));

  it('should reset the cards properly after they were revealed', async(() => {
    fixture.whenStable().then(() => {
      const playCardButton: HTMLButtonElement = fixture.nativeElement.querySelector('button#playCardButton');
      playCardButton.click();
      fixture.detectChanges();
      const card4: HTMLElement = fixture.nativeElement.querySelector('div#card-4');
      card4.click();
      fixture.detectChanges();
      const revealCardsButton: HTMLButtonElement = fixture.nativeElement.querySelector('button#revealCardsButton');
      revealCardsButton.click();
      fixture.detectChanges();
      const resetCardsButton: HTMLButtonElement = fixture.nativeElement.querySelector('button#resetCardsButton');
      resetCardsButton.click();
      fixture.detectChanges();
      const card4Title: HTMLElement = fixture.nativeElement.querySelector('div#card-4 > div > h3');
      expect(card4Title.classList.contains('selected')).toBeFalse();
      const userCard: HTMLElement = fixture.nativeElement.querySelector('div#otherUsersContainer > .card');
      expect(userCard.classList.contains('bg-success')).toBeFalse();
    });
  }));

  it('should show the correct card when the user changed their mind', async(() => {
    fixture.whenStable().then(() => {
      const playCardButton: HTMLButtonElement = fixture.nativeElement.querySelector('button#playCardButton');
      playCardButton.click();
      fixture.detectChanges();
      const card4: HTMLElement = fixture.nativeElement.querySelector('div#card-4');
      card4.click();
      fixture.detectChanges();
      playCardButton.click();
      const card1: HTMLElement = fixture.nativeElement.querySelector('div#card-1');
      card1.click();
      fixture.detectChanges();

      const card4Title: HTMLElement = fixture.nativeElement.querySelector('div#card-4 > div > h3');
      expect(card4Title.classList.contains('selected')).toBeFalse();
      const card1Title: HTMLElement = fixture.nativeElement.querySelector('div#card-1 > div > h3');
      expect(card1Title.classList.contains('selected')).toBeTrue();
      const userCard: HTMLElement = fixture.nativeElement.querySelector('div#otherUsersContainer > .card');
      expect(userCard.classList.contains('bg-success')).toBeTrue();

      const revealCardsButton: HTMLButtonElement = fixture.nativeElement.querySelector('button#revealCardsButton');
      revealCardsButton.click();
      fixture.detectChanges();
      const selectedCard: HTMLElement = fixture.nativeElement.querySelector('div#otherUsersContainer > .card > .card-body > .card-text');
      expect(selectedCard.innerHTML).toEqual("2");
    });
  }));
});
