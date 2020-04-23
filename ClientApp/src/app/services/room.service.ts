import { Injectable, HostListener } from '@angular/core';
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
  selectedCard: number;
  cardsRevealed: boolean = false;
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
      console.log("User " + userId + " left");
      let index = this.users.findIndex(user => user.userId == userId)
      this.users.splice(index, 1);
    });

    this._hubConnection.on("CardSelected", (userId, selectedCard) => {
      let index = this.users.findIndex(user => user.userId === userId);
      this.users[index].selectedCard = selectedCard;
    });

    this._hubConnection.on("CardsRevealed", () => {
      this.cardsRevealed = true;
    });

    this._hubConnection.on("CardsReset", () => {
      this.selectedCard = -1;
      this.cardsRevealed = false;
      for (let user of this.users)
        user.selectedCard = -1;
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

  async joinRoom(username: string, roomId: string = this.roomId): Promise<boolean> {
    // Set data
    this.username = username;
    this.roomId = roomId;
    console.log("Your room ID is " + this.roomId);

    // Invoke hub function
    await this._hubConnection.invoke("JoinRoom", roomId, username).then((newUserId) => {
      this.userId = newUserId;
      console.log("Your user ID is " + this.userId);
    });

    // Check if the specified room exists
    if (this.userId == "ROOM_DOES_NOT_EXIST") return false;
    return true;
  }

  async getUsers() {
    await this._hubConnection.invoke("GetUsers", this.roomId).then((jsonUsers) => {
      // Check if room exists
      if (jsonUsers == "ROOM_DOES_NOT_EXIST") return;

      var users = JSON.parse(jsonUsers);
      for (let user of users) {
        if(user.Id != this.userId)
          this.addUserToList(user.Id, user.Name, user.SelectedCard);
      }
    });
  }

  leaveRoom() {
    this._hubConnection.invoke("LeaveRoom", this.roomId, this.userId);
  }

  selectCard(selectedCard: number) {
    if (selectedCard == this.selectedCard)
      this.selectedCard = -1;
    else
      this.selectedCard = selectedCard;

    this._hubConnection.invoke("SelectCard", this.roomId, this.userId, this.selectedCard);
  }

  revealCards() {
    this._hubConnection.invoke("RevealCards", this.roomId);
  }

  resetCards() {
    this._hubConnection.invoke("ResetCards", this.roomId);
  }

  private addUserToList(userId: string, username: string, selectedCard: number = -1) {
    let newUser = new User();
    newUser.userId = userId;
    newUser.username = username;
    newUser.selectedCard = selectedCard;
    this.users.push(newUser);
  }
}
