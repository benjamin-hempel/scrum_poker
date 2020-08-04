import * as signalR from '@aspnet/signalr';

import { Injectable } from '@angular/core';
import { BackendInterface } from './backend.interface';
import { RoomCallbacks } from '../room-callbacks';
import { Room } from '../../models/room';

@Injectable({
  providedIn: 'root',
})
export class SignalRService implements BackendInterface {
  private hubConnection: signalR.HubConnection;
  private callbacks: RoomCallbacks;

  constructor(room: Room) {
    this.createConnection();

    this.callbacks = new RoomCallbacks(room);
    this.registerCallbacks();
  }

  private createConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(window.location.protocol + "//" + window.location.host + "/roomHub")
      .build();
  }

  private registerCallbacks(): void {
    this.hubConnection.on("UserJoined", (userId, username, isAdmin) => {
      this.callbacks.UserJoinedCallback(userId, username, isAdmin);
    });

    this.hubConnection.on("UserLeft", (userId) => {
      this.callbacks.UserLeftCallback(userId);
    });

    this.hubConnection.on("CardSelected", (userId, selectedCard, playedCards) => {
      this.callbacks.CardSelectedCallback(userId, selectedCard, playedCards);
    });

    this.hubConnection.on("CardsRevealed", () => {
      this.callbacks.CardsRevealedCallback();
    });

    this.hubConnection.on("CardsReset", () => {
      this.callbacks.CardsResetCallback();
    });
  }

  public async startConnection(): Promise<void> {
    await this.hubConnection
      .start()
      .catch(err => console.log("Unable to connect to SignalR hub. " + err));
  }

  public getConnectionStatus(): number {
    return this.hubConnection.state;
  }

  public async createRoom(cardDeck: string, allUsersAreAdmins: boolean): Promise<string> {
    var result: string = await this.hubConnection.invoke("CreateRoom", cardDeck, allUsersAreAdmins)
      .then(roomId => { return roomId; });

    return result;
  }

  public async joinRoom(username: string, roomId: string): Promise<string> {
    var result: string = await this.hubConnection.invoke("JoinRoom", roomId, username)
      .then(data => { return data; });

    return result;
  }

  public async getUsers(roomId: string): Promise<string> {
    var result: string = await this.hubConnection.invoke("GetUsers", roomId)
      .then(data => { return data; });

    return result;
  }

  public leaveRoom(roomId: string, userId: string): void {
    this.hubConnection.invoke("LeaveRoom", roomId, userId);
  }

  public async rejoinRoom(roomId: string, userId: string): Promise<string> {
    var result: string = await this.hubConnection.invoke("Rejoin", roomId, userId)
      .then(data => { return data; })

    return result;
  }

  public selectCard(roomId: string, userId: string, selectedCard: number): void {
    this.hubConnection.invoke("SelectCard", roomId, userId, selectedCard);
  }

  public revealCards(roomId: string): void {
    this.hubConnection.invoke("RevealCards", roomId);
  }

  public resetCards(roomId: string): void {
    this.hubConnection.invoke("ResetCards", roomId);
  }
}
