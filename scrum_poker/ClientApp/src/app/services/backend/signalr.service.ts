import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

import { BackendInterface } from './backend.interface';
import { RoomCallbacks } from '../room-callbacks';
import { Room } from '../../models/room';

export class SignalRService implements BackendInterface {
  private hubConnection: signalR.HubConnection;
  private callbacks: RoomCallbacks;

  constructor(private room: Room) {
    this.createConnection();

    this.callbacks = new RoomCallbacks(room);
    this.registerCallbacks();

    this.startConnection();
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

  private startConnection() {
    this.hubConnection
      .start()
      .catch(err => console.log("Unable to connect to SignalR hub. " + err));
  }
}
