import { } from 'jasmine';
import { TestBed } from '@angular/core/testing';

import { RoomService } from '../services/room.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Room } from '../models/room';
import { MockBackendService } from './backend/mock-backend.service';

describe('RoomService', () => {
  var roomService: RoomService;
  var room: Room;

  beforeEach(async function() {
    TestBed.configureTestingModule({
      providers: [RoomService, Room],
      imports: [RouterTestingModule]
    });

    roomService = TestBed.get(RoomService);
  });

  it('should be defined', async function () {
    expect(roomService).toBeInstanceOf(RoomService);
    expect(roomService.backend).toBeInstanceOf(MockBackendService)
  });
});
