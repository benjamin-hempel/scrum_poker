import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private _hubConnection: signalR.HubConnection;

  roomId: string;
  username: string;
  userId: string;

  constructor() {
    this.createConnection();
    this.startConnection();
  }

  private createConnection() {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44317/roomHub")
      .build();
  }

  private registerCallbacks() {
    this._hubConnection.on("UserJoined", (userId, username) => {

    });

    this._hubConnection.on("UserLeft", (userId) => {

    });

    this._hubConnection.on("CardSelected", (userId, cardSelected) => {

    });

    this._hubConnection.on("CardRevealed", (userId, selectedCard) => {

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

  async joinRoom(username: string) {
    this.username = username;
    console.log("Your room ID is " + this.roomId);
    await this._hubConnection.invoke("JoinRoom", this.roomId, username).then((newUserId) => {
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
}
