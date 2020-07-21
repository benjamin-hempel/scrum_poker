import { } from 'jasmine';
import validator from 'validator';
import { TestBed } from '@angular/core/testing';

import { RoomService } from '../services/room.service';
import { Room } from '../models/room';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackendService } from './backend/mock-backend.service';

describe('RoomService', () => {
  var roomService: RoomService;
  var room: Room;

  beforeEach(function() {
    TestBed.configureTestingModule({
      providers: [RoomService, Room],
      imports: [RouterTestingModule]
    });

    this.roomService = TestBed.get(RoomService);
    this.room = TestBed.get(Room);
  });

  it('should be defined and have a mock backend available', function () {
    expect(this.roomService).toBeInstanceOf(RoomService);
    expect(this.roomService.backend).toBeInstanceOf(MockBackendService);
  });

  it('should enable creating a new room', async function () {
    await this.roomService.createRoom("1,2,3,4,5,6", false);

    // Check if room was provided valid UUID
    var isUuid = validator.isUUID(this.room.roomId);
    expect(isUuid).toBeTrue();

    // Check if cards were set correctly
    expect(this.room.cards).toEqual(["1", "2", "3", "4", "5", "6"]);
  });

  it('should enable users to join an existing room', async function () {
    await this.roomService.createRoom("1,2,3,4,5,6", false);
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
});
