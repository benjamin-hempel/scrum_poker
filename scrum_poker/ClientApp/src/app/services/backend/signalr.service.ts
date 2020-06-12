import * as signalR from '@aspnet/signalr';

import { Room } from '../../models/room';
import { User } from '../../models/user';

export class SignalRService implements BackendInterface {
  private hubConnection: signalR.HubConnection;

  constructor(private room: Room) {
    this.createConnection();
    this.registerCallbacks();
  }

  private createConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(window.location.protocol + "//" + window.location.host + "/roomHub")
      .build();
  }

  private registerCallbacks() {
    this.hubConnection.on("UserJoined", (userId, username, isAdmin) => {
      this.room.addUser(userId, username, isAdmin);
    });

    this.hubConnection.on("UserLeft", (userId) => {
      this.room.removeUser(userId);
    });

    this.hubConnection.on("CardSelected", (userId, selectedCard, playedCards) => {
      var user: User = this.room.getUserById(userId);
      user.selectedCard = selectedCard;
      this.room.playedCards = playedCards;
    });

    this.hubConnection.on("CardsRevealed", () => {
      this.room.cardsRevealed = true;
    });

    this.hubConnection.on("CardsReset", () => {
      this.room.you.selectedCard = -1;
      this.room.cardsRevealed = false;
      for (let user of this.room.users)
        user.selectedCard = -1;
    });
  }
}
