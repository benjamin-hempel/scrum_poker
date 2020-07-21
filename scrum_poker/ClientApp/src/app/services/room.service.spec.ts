import { } from 'jasmine';
import { TestBed } from '@angular/core/testing';

import { RoomService } from '../services/room.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackendService } from './backend/mock-backend.service';

describe('RoomService', () => {
  beforeEach(function() {
    TestBed.configureTestingModule({
      providers: [RoomService, MockBackendService],
      imports: [RouterTestingModule]
    });
  });

  it('should be defined', function () {
    var roomService = TestBed.get(RoomService);

    expect(roomService).toBeInstanceOf(RoomService);
    expect(roomService.backend).toBeInstanceOf(MockBackendService);
  });
});
