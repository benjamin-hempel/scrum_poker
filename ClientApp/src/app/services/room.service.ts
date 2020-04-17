import { Injectable } from '@angular/core';
import { User } from '../user';
import * as signalR from "@aspnet/signalr";

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private _hubConnection: signalR.HubConnection;

  roomId: string;
  username: string;
  userId: string;
  users: Array<User>;

  constructor() {
    this.createConnection();
    this.registerCallbacks();
    this.startConnection();

    this.users = new Array<User>();
  }

  private createConnection() {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44317/roomHub")
      .build();
  }

  private registerCallbacks() {
    this._hubConnection.on("UserJoined", (userId, username) => {
      this.addUserToList(userId, username);
    });

    this._hubConnection.on("UserLeft", (userId) => {

    });

    this._hubConnection.on("CardSelected", (userId, selectedCard) => {

    });

    this._hubConnection.on("CardsRevealed", () => {

    });

    this._hubConnection.on("CardsReset", () => {

    });
  }

  private startConnection() {
    this._hubConnection
      .start()
      .then(() => console.log("Established connection to SignalR hub."))
      .catch(err => console.log("Failed to establish connection to SignalR hub: " + err));
  }

  async createRoom() {
    await this._hubConnection.invoke("CreateRoom").then((newRoomId) => {
      this.roomId = newRoomId;
    });
  }

  async joinRoom(username: string, roomId: string = this.roomId) {
    this.username = username;
    this.roomId = roomId;
    console.log("Your room ID is " + this.roomId);

    await this._hubConnection.invoke("JoinRoom", roomId, username).then((newUserId) => {
      this.userId = newUserId;
      console.log("Your user ID is " + this.userId);
    });
  }

  leaveRoom(roomId: string, userId: string) {
    this._hubConnection.invoke("LeaveRoom", roomId, userId);
  }

  selectCard(roomId: string, userId: string, selectedCard: number) {
    this._hubConnection.invoke("SelectCard", roomId, userId, selectedCard);
  }

  revealCards(roomId: string) {
    this._hubConnection.invoke("RevealCards", roomId);
  }

  resetCards(roomId: string) {
    this._hubConnection.invoke("ResetCards", roomId);
  }

  private addUserToList(userId: string, username: string) {
    let newUser = new User();
    newUser.userId = userId;
    newUser.username = username;
    this.users.push(newUser);
  }
}
