import { } from 'jasmine';
import validator from 'validator';
import { TestBed } from '@angular/core/testing';

import { RoomService } from '../services/room.service';
import { Room } from '../models/room';
import { User } from '../models/user';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackendService } from './backend/mock-backend.service';

describe('RoomService', () => {
  var roomService: RoomService;
  var room: Room;

  beforeEach(async function() {
    TestBed.configureTestingModule({
      providers: [RoomService, Room],
      imports: [RouterTestingModule]
    });

    this.roomService = await TestBed.get(RoomService);
    this.room = await TestBed.get(Room);

    await this.roomService.createRoom("1,2,3,4,5,6", false);
  });

  it('should be defined and have a mock backend available', function () {
    expect(this.roomService).toBeInstanceOf(RoomService);
    expect(this.roomService.backend).toBeInstanceOf(MockBackendService);
  });

  it('should enable creating a new room', async function () {
    // Check if room was provided valid UUID
    var isUuid = validator.isUUID(this.room.roomId);
    expect(isUuid).toBeTrue();

    // Check if cards were set correctly
    expect(this.room.cards).toEqual(["1", "2", "3", "4", "5", "6"]);
  });

  it('should enable users to join an existing room', async function () {
    var result: string = await this.roomService.joinRoom("Ronald McDonald", this.room.roomId);

    // Check returned result
    expect(result).toEqual("JOIN_SUCCESSFUL");

    // Check if room data was set accordingly
    expect(this.room.you.username).toEqual("Ronald McDonald");
    var isUuid = validator.isUUID(this.room.you.userId);
    expect(isUuid).toBeTrue();
    expect(this.room.you.isAdmin).toBeTrue();
    expect(this.room.cardsRevealed).toBeFalse();
    expect(this.room.playedCards).toEqual(0);
  });

  it('should have an up-to-date list of users after multiple joins and leaves', async function () {
    await this.roomService.joinRoom("Ronald McDonald", this.room.roomId);
    await this.roomService.joinRoom("Colonel Sanders", this.room.roomId);
    this.roomService.leaveRoom();
    await this.roomService.joinRoom("Chuck E. Cheese", this.room.roomId);

    // Check if user list is correct
    expect(this.room.users.length).toBe(2);
    expect(this.room.users[0].username).toEqual("Ronald McDonald");
    expect(this.room.users[0].selectedCard).toEqual(-1);
    expect(this.room.users[0].isAdmin).toBeTrue();
    expect(this.room.users[1].username).toEqual("Chuck E. Cheese");
    expect(this.room.users[1].selectedCard).toEqual(-1);
    expect(this.room.users[1].isAdmin).toBeFalse();
  });

  it('should allow revealing and resetting the room\'s cards', async function () {
    await this.roomService.joinRoom("Ronald McDonald", this.room.roomId);

    this.roomService.revealCards();
    expect(this.room.cardsRevealed).toBeTrue();
    this.roomService.resetCards();
    expect(this.room.cardsRevealed).toBeFalse();
  })

  it('should allow selecting and deselecting cards', async function () {
    await this.roomService.joinRoom("Ronald McDonald", this.room.roomId);

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
  });

  it('should allow rejoining a room given correct room and user IDs', async function () {
    await this.roomService.joinRoom("Ronald McDonald", this.room.roomId);

    // Keep IDs for rejoin
    var roomId: string = this.room.roomId;
    var userId: string = this.room.you.userId;

    this.roomService.selectCard(3);
    this.roomService.revealCards();
    this.roomService.leaveRoom();

    // Clear frontend-only data
    // Needs to be done like this because this.room is a singleton
    this.room.roomId = null;
    this.room.cardsRevealed = false;
    this.room.playedCards = 0;
    this.room.cards = null;
    this.room.you = new User();
    this.room.users = new Array<User>();

    // Rejoin room
    this.room.roomId = roomId;
    this.room.you.userId = userId;
    await this.roomService.rejoinRoom();

    // Check if data is set correctly
    expect(this.room.you.username).toEqual("Ronald McDonald");
    expect(this.room.you.selectedCard).toEqual(3);
    expect(this.room.you.isAdmin).toBeTrue();
    expect(this.room.cardsRevealed).toBeTrue();
    expect(this.room.cards).toEqual(["1", "2", "3", "4", "5", "6"]);
    expect(this.room.playedCards).toEqual(1);
  });
});
