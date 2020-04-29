import { Injectable, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user';
import * as signalR from "@aspnet/signalr";

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private _hubConnection: signalR.HubConnection;

  roomId: string;
  cardsRevealed: boolean = false;
  cardDeck: string;

  you: User;
  
  users: Array<User>;

  constructor(private route: ActivatedRoute) {
    this.createConnection();
    this.registerCallbacks();
    this.startConnection();

    this.you = new User();
    this.users = new Array<User>();
  }

  private createConnection() {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(window.location.protocol + "//" + window.location.host + "/roomHub")
      .build();
  }

  private registerCallbacks() {
    this._hubConnection.on("UserJoined", (userId, username, isAdmin) => {
      this.addUserToList(userId, username, isAdmin);
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
      this.you.selectedCard = -1;
      this.cardsRevealed = false;
      for (let user of this.users)
        user.selectedCard = -1;
    });
  }

  private startConnection() {
    this._hubConnection
      .start()
      .then(() => {
        if (this.roomId == null || this.you.userId == null) return;
        this.rejoinRoom().then(() => this.getUsers());  
      })
      .catch(err => console.log("Failed to establish connection to SignalR hub: " + err));
  }

  async createRoom(cardDeck: string, allUsersAreAdmins: boolean) {
    await this._hubConnection.invoke("CreateRoom", cardDeck, allUsersAreAdmins).then((newRoomId) => {
      this.roomId = newRoomId;
    });
  }

  async joinRoom(username: string, roomId: string = this.roomId): Promise<string> {
    // Set data
    this.you.username = username;
    this.roomId = roomId;
    console.log("Your room ID is " + this.roomId);

    // Invoke hub function
    let result = await this._hubConnection.invoke("JoinRoom", roomId, username).then((jsonData) => {
      if (jsonData == "ROOM_DOES_NOT_EXIST" || jsonData == "CONNECTION_ALREADY_EXISTS")
        return jsonData;

      let data = JSON.parse(jsonData)
      this.you.userId = data.Id;
      this.you.isAdmin = data.IsAdmin;
      this.cardDeck = data.CardDeck;
      console.log("Your user ID is " + this.you.userId);
      return "JOIN_SUCCESSFUL";
    });

    return result;
  }

  async getUsers() {
    await this._hubConnection.invoke("GetUsers", this.roomId).then((jsonUsers) => {
      // Check if room exists
      if (jsonUsers == "ROOM_DOES_NOT_EXIST") return;

      var users = JSON.parse(jsonUsers);
      for (let user of users) {
        if(user.Id != this.you.userId)
          this.addUserToList(user.Id, user.Name, user.IsAdmin, user.SelectedCard);
      }
    });
  }

  leaveRoom() {
    this._hubConnection.invoke("LeaveRoom", this.roomId, this.you.userId);
  }

  async rejoinRoom() {
    await this._hubConnection.invoke("Rejoin", this.roomId, this.you.userId).then((result) => {
      if (result == "ROOM_DOES_NOT_EXIST" || result == "USER_DOES_NOT_EXIST") {
        this.roomId = null;
        this.you.userId = null;
        return;
      }
      var data = JSON.parse(result);
      this.you.username = data.Name;
      this.you.selectedCard = data.SelectedCard;
      this.you.isAdmin = data.IsAdmin;
      this.cardsRevealed = data.CardsRevealed;
      this.cardDeck = data.CardDeck;
    });
  }

  selectCard(selectedCard: number) {
    if (selectedCard == this.you.selectedCard)
      this.you.selectedCard = -1;
    else
      this.you.selectedCard = selectedCard;

    this._hubConnection.invoke("SelectCard", this.roomId, this.you.userId, this.you.selectedCard);
  }

  revealCards() {
    this._hubConnection.invoke("RevealCards", this.roomId);
  }

  resetCards() {
    this._hubConnection.invoke("ResetCards", this.roomId);
  }

  private addUserToList(userId: string, username: string, isAdmin: boolean, selectedCard: number = -1) {
    let newUser = new User();
    newUser.userId = userId;
    newUser.username = username;
    newUser.selectedCard = selectedCard;
    newUser.isAdmin = isAdmin;
    this.users.push(newUser);
  }
}
