import { BackendInterface } from './backend.interface';
import { RoomCallbacks } from '../room-callbacks';
import { Room } from '../../models/room';
import { MockRoom } from '../../models/mocks/mock-room';
import { MockUser } from '../../models/mocks/mock-user';

/* This allows frontend testing without the backend running. */
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

  public joinRoom(username: string, roomId: string): string {
    var room: MockRoom = this.rooms.find(x => x.id == roomId);
    if (room == null)
      return "ROOM_DOES_NOT_EXIST";

    var user: MockUser = room.addUser(username);

    this.callbacks.UserJoinedCallback(user.id, user.name, user.isAdmin);

    var obj: object = <object>({ Id: user.id, IsAdmin: user.isAdmin, CardDeck: room.cardDeck, CardsRevealed: room.cardsRevealed, PlayedCards: room.playedCards });
    return JSON.stringify(obj);
  }

  public leaveRoom(roomId: string, userId: string): void {
    var room: MockRoom = this.rooms.find(x => x.id == roomId);
    if (room == null)
      return;

    var user: MockUser = room.getUser(userId);
    if (user == null)
      return;

    /* Please note that data is not persistent across page reloads */
    user.missingInAction = true;
    window.setTimeout(this.removeUserFromRoom, 30000, room, user);

    if (room.getActiveUsers().length == 0)
      window.setTimeout(this.removeRoom, 30000, room);

    this.callbacks.UserLeftCallback(userId);
  }

  public rejoinRoom(roomId: string, userId: string): string {
    var room: MockRoom = this.rooms.find(x => x.id == roomId);
    if (room == null)
      return "ROOM_DOES_NOT_EXIST";

    var user: MockUser = room.getUser(userId);
    if (user == null)
      return "USER_DOES_NOT_EXIST";
    user.missingInAction = false;

    this.callbacks.UserJoinedCallback(user.id, user.name, user.isAdmin);
    if (user.selectedCard > -1)
      this.callbacks.CardSelectedCallback(user.id, user.selectedCard);

    var obj: object = <object>({ Name: user.name, SelectedCard: user.selectedCard, CardsRevealed: room.cardsRevealed, IsAdmin: user.isAdmin, CardDeck: room.cardDeck, PlayedCards: room.playedCards });
    return JSON.stringify(obj);
  }

  public selectCard(roomId: string, userId: string, selectedCard: number): void {
    var room: MockRoom = this.rooms.find(x => x.id == roomId);
    if (room == null)
      return;

    var user: MockUser = room.getUser(userId);
    if (user == null)
      return;

    if (user.selectedCard == -1)
      room.playedCards++;
    if (selectedCard == -1)
      room.playedCards--;

    user.selectedCard = selectedCard;

    this.callbacks.CardSelectedCallback(userId, user.selectedCard, room.playedCards);
  }

  public revealCards(roomId: string): void {
    var room: MockRoom = this.rooms.find(x => x.id == roomId);
    if (room == null)
      return;

    room.cardsRevealed = true;

    this.callbacks.CardsRevealedCallback();
  }

  public resetCards(roomId: string): void {
    var room: MockRoom = this.rooms.find(x => x.id == roomId);
    if (room == null)
      return;

    room.getAllUsers().forEach((user) => {
      user.selectedCard = -1;
    });

    room.cardsRevealed = false;

    this.callbacks.CardsResetCallback();
  }

  public getUsers(roomId: string): string {
    var room: MockRoom = this.rooms.find(x => x.id == roomId);
    if (room == null)
      return "ROOM_DOES_NOT_EXIST";

    var users: Array<MockUser> = room.getActiveUsers();
    return JSON.stringify(users);
  }

  private removeUserFromRoom(room: MockRoom, user: MockUser): void {
    if (user.missingInAction == true)
      room.removeUser(user.id);
  }

  private removeRoom(room: MockRoom): void {
    if (room.getActiveUsers().length == 0) {
      var index: number = this.rooms.findIndex(x => x.id == room.id);
      this.rooms.splice(index, 1);
    }
  }
}
