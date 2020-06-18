import { v4 as uuidv4 } from 'uuid';

import { BackendInterface } from './backend.interface';
import { RoomCallbacks } from '../room-callbacks';
import { Room } from '../../models/room';
import { MockRoom } from '../../models/mocks/mock-room';

export class MockBackendService implements BackendInterface {
  private callbacks: RoomCallbacks;
  private rooms: Array<MockRoom>;

  constructor(room: Room) {
    this.callbacks = new RoomCallbacks(room);
    this.rooms = new Array<MockRoom>();
  }

  public createRoom(cardDeck: string, allUsersAreAdmins: boolean): string {
    var newRoom: MockRoom = new MockRoom(cardDeck, allUsersAreAdmins);
    this.rooms.push(newRoom);

    return newRoom.id;
  }
}
