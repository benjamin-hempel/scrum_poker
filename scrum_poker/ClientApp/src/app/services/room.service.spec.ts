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

    roomService = await TestBed.get(RoomService);
    room = await TestBed.get(Room);

    await roomService.createRoom("1,2,3,4,5,6", false);
  });

  it('should be defined and have a mock backend available', function () {
    expect(roomService).toBeInstanceOf(RoomService);
    expect(roomService.backend).toBeInstanceOf(MockBackendService);
  });

  it('should enable creating a new room', async function () {
    // Check if room was provided valid UUID
    var isUuid = validator.isUUID(room.roomId);
    expect(isUuid).toBeTrue();

    // Check if cards were set correctly
    expect(room.cards).toEqual(["1", "2", "3", "4", "5", "6"]);
  });

  it('should enable users to join an existing room', async function () {
    var result: string = await roomService.joinRoom("Ronald McDonald", room.roomId);

    // Check returned result
    expect(result).toEqual("JOIN_SUCCESSFUL");

    // Check if room data was set accordingly
    expect(room.you.username).toEqual("Ronald McDonald");
    var isUuid = validator.isUUID(room.you.userId);
    expect(isUuid).toBeTrue();
    expect(room.you.isAdmin).toBeTrue();
    expect(room.cardsRevealed).toBeFalse();
    expect(room.playedCards).toEqual(0);
  });

  it('should have an up-to-date list of users after multiple joins and leaves', async function () {
    await roomService.joinRoom("Ronald McDonald", room.roomId);
    await roomService.joinRoom("Colonel Sanders", room.roomId);
    roomService.leaveRoom();
    await roomService.joinRoom("Chuck E. Cheese", room.roomId);

    // Check if user list is correct
    expect(room.users.length).toBe(2);
    expect(room.users[0].username).toEqual("Ronald McDonald");
    expect(room.users[0].selectedCard).toEqual(-1);
    expect(room.users[0].isAdmin).toBeTrue();
    expect(room.users[1].username).toEqual("Chuck E. Cheese");
    expect(room.users[1].selectedCard).toEqual(-1);
    expect(room.users[1].isAdmin).toBeFalse();
  });

  it('should allow revealing and resetting the room\'s cards', async function () {
    await roomService.joinRoom("Ronald McDonald", room.roomId);

    roomService.revealCards();
    expect(room.cardsRevealed).toBeTrue();
    roomService.resetCards();
    expect(room.cardsRevealed).toBeFalse();
  })

  it('should allow selecting and deselecting cards', async function () {
    await roomService.joinRoom("Ronald McDonald", room.roomId);

    // Select card and change opinion before reveal
    roomService.selectCard(3);
    expect(room.you.selectedCard).toEqual(3);
    roomService.selectCard(5);
    expect(room.you.selectedCard).toEqual(5);
    expect(room.playedCards).toEqual(1);

    // Check correct reveal/reset behaviour
    roomService.revealCards();
    roomService.resetCards();
    expect(room.you.selectedCard).toEqual(-1);

    // Check correct deselect behaviour
    roomService.selectCard(2);
    expect(room.you.selectedCard).toEqual(2);
    expect(room.playedCards).toEqual(2);
    roomService.selectCard(2);
    expect(room.you.selectedCard).toEqual(-1);
    expect(room.playedCards).toEqual(1);
  });

  it('should allow rejoining a room given correct room and user IDs', async function () {
    await roomService.joinRoom("Ronald McDonald", room.roomId);

    // Keep IDs for rejoin
    var roomId: string = room.roomId;
    var userId: string = room.you.userId;

    roomService.selectCard(3);
    roomService.revealCards();
    roomService.leaveRoom();

    // Clear frontend-only data
    // Needs to be done like this because room is a singleton
    room.roomId = null;
    room.cardsRevealed = false;
    room.playedCards = 0;
    room.cards = null;
    room.you = new User();
    room.users = new Array<User>();

    // Rejoin room
    room.roomId = roomId;
    room.you.userId = userId;
    await roomService.rejoinRoom();

    // Check if data is set correctly
    expect(room.you.username).toEqual("Ronald McDonald");
    expect(room.you.selectedCard).toEqual(3);
    expect(room.you.isAdmin).toBeTrue();
    expect(room.cardsRevealed).toBeTrue();
    expect(room.cardsRevealed).toBeTrue();
    expect(room.cards).toEqual(["1", "2", "3", "4", "5", "6"]);
    expect(room.playedCards).toEqual(1);
  });
});
