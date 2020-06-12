import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";

import { Room } from '../models/room';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private _hubConnection: signalR.HubConnection;

  constructor(private room: Room) {
    // Setup and start connection
    this.createConnection();
    this.registerCallbacks();
    this.startConnection();
  }

  private createConnection() {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(window.location.protocol + "//" + window.location.host + "/roomHub")
      .build();
  }

  private registerCallbacks() {
    this._hubConnection.on("UserJoined", (userId, username, isAdmin) => {
      this.room.addUser(userId, username, isAdmin);
    });

    this._hubConnection.on("UserLeft", (userId) => {
      this.room.removeUser(userId);
    });

    this._hubConnection.on("CardSelected", (userId, selectedCard, playedCards) => {
      var user: User = this.room.getUserById(userId);
      user.selectedCard = selectedCard;
      this.room.playedCards = playedCards;
    });

    this._hubConnection.on("CardsRevealed", () => {
      this.room.cardsRevealed = true;
    });

    this._hubConnection.on("CardsReset", () => {
      this.room.you.selectedCard = -1;
      this.room.cardsRevealed = false;
      for (let user of this.room.users)
        user.selectedCard = -1;
    });
  }

  private startConnection() {
    this._hubConnection
      .start()
      .then(() => {
        // Try rejoining if room and user ID were found in the URL
        if (this.room.roomId == null || this.room.you.userId == null) return;
        this.rejoinRoom().then(() => this.getUsers());  
      })
      .catch(err => console.log("Could not establish connection to SignalR hub: " + err));
  }

  async createRoom(cardDeck: string, allUsersAreAdmins: boolean) {
    this.room.cards = cardDeck.split(',');
    await this._hubConnection.invoke("CreateRoom", cardDeck, allUsersAreAdmins).then((newRoomId) => {
      this.room.roomId = newRoomId;
    });
  }

  async joinRoom(username: string, roomId: string = this.room.roomId): Promise<string> {
    // Set data
    this.room.you.username = username;
    this.room.roomId = roomId;

    // Invoke hub function
    let result = await this._hubConnection.invoke("JoinRoom", roomId, username).then((jsonData) => {
      // Abort on error
      if (jsonData == "ROOM_DOES_NOT_EXIST" || jsonData == "CONNECTION_ALREADY_EXISTS")
        return jsonData;

      // Get data from JSON
      let data = JSON.parse(jsonData)
      this.room.you.userId = data.Id;
      this.room.you.isAdmin = data.IsAdmin;
      this.room.cards = data.CardDeck.split(',');
      this.room.cardsRevealed = data.CardsRevealed;
      this.room.playedCards = data.PlayedCards;

      return "JOIN_SUCCESSFUL";
    });

    return result;
  }

  async getUsers() {
    await this._hubConnection.invoke("GetUsers", this.room.roomId).then((jsonUsers) => {
      // Check if room exists
      if (jsonUsers == "ROOM_DOES_NOT_EXIST") return;

      // Get user data from JSON
      var users = JSON.parse(jsonUsers);
      for (let user of users) {
        if(user.Id != this.room.you.userId)
          this.room.addUser(user.Id, user.Name, user.IsAdmin, user.SelectedCard);
      }
    });
  }

  leaveRoom() {
    this._hubConnection.invoke("LeaveRoom", this.room.roomId, this.room.you.userId);
  }

  async rejoinRoom() {
    await this._hubConnection.invoke("Rejoin", this.room.roomId, this.room.you.userId).then((result) => {
      // Abort if room or user do not exist
      if (result == "ROOM_DOES_NOT_EXIST" || result == "USER_DOES_NOT_EXIST") {
        this.room.roomId = null;
        this.room.you.userId = null;
        return;
      }

      // Get data from JSON
      var data = JSON.parse(result);
      this.room.you.username = data.Name;
      this.room.you.selectedCard = data.SelectedCard;
      this.room.you.isAdmin = data.IsAdmin;
      this.room.cardsRevealed = data.CardsRevealed;
      this.room.cards = data.CardDeck.split(',');
      this.room.playedCards = data.PlayedCards;
    });
  }

  selectCard(selectedCard: number) {
    // Deselect card if the user clicks the same card again
    if (selectedCard == this.room.you.selectedCard)
      this.room.you.selectedCard = -1;
    else
      this.room.you.selectedCard = selectedCard;

    this._hubConnection.invoke("SelectCard", this.room.roomId, this.room.you.userId, this.room.you.selectedCard);
  }

  revealCards() {
    this._hubConnection.invoke("RevealCards", this.room.roomId);
  }

  resetCards() {
    this._hubConnection.invoke("ResetCards", this.room.roomId);
  }
}
