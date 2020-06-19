import { } from 'jasmine';
import { TestBed } from '@angular/core/testing';

import { RoomService } from '../services/room.service';

describe('RoomService', () => {
  var roomService: RoomService;

  TestBed.configureTestingModule({
    providers: [RoomService]
  });

  beforeEach(() => {
    roomService = TestBed.get(RoomService);
  });

  it('should be connected to the SignalR hub', () => {
    expect(roomService.backend).toBeDefined();
  });
});
