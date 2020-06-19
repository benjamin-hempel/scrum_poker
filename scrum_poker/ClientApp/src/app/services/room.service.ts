import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { BackendInterface } from './backend/backend.interface';
import { Room } from '../models/room';
import { SignalRService } from './backend/signalr.service';
import { MockBackendService } from './backend/mock-backend.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  public backend: BackendInterface;

  constructor(private room: Room, private router: Router) {
    var signalRService: SignalRService = new SignalRService(room);

    signalRService.startConnection().then(() => {
      // Fall back to mock service if connection failed and environment is non-production
      if (signalRService.getConnectionStatus() == 1)
        this.backend = signalRService;
      else if (!environment.production) {
        console.log("Falling back to mock backend.");
        //this.backend = new MockBackendService(room);
      }
      else {
        this.backend = null;
        router.navigate(["/error", { cause: "service-unavailable" }])
      }
        
      // Try rejoining if room and user ID were found in the URL
      if (this.room.roomId == null || this.room.you.userId == null) return;
      this.rejoinRoom().then(() => this.getUsers());  
    });  
  }

  public async createRoom(cardDeck: string, allUsersAreAdmins: boolean): Promise<void> {
    this.room.cards = cardDeck.split(',');

    var roomId: string = await this.backend.createRoom(cardDeck, allUsersAreAdmins);
    this.room.roomId = roomId;
  }

  public async joinRoom(username: string, roomId: string = this.room.roomId): Promise<string> {
    this.room.you.username = username;
    this.room.roomId = roomId;

    var json: string = await this.backend.joinRoom(username, roomId);
    if (json == "ROOM_DOES_NOT_EXIST" || json == "CONNECTION_ALREADY_EXISTS")
      return json;

    var data = JSON.parse(json);
    this.room.you.userId = data.Id;
    this.room.you.isAdmin = data.IsAdmin;
    this.room.cards = data.CardDeck.split(',');
    this.room.cardsRevealed = data.CardsRevealed;
    this.room.playedCards = data.PlayedCards;

    return "JOIN_SUCCESSFUL";
  }

  public async getUsers(): Promise<void> {
    var json: string = await this.backend.getUsers(this.room.roomId);
    if (json == "ROOM_DOES_NOT_EXIST") return;

    var users = JSON.parse(json);
    for (let user of users) {
      if (user.Id != this.room.you.userId)
        this.room.addUser(user.Id, user.Name, user.IsAdmin, user.SelectedCard);
    }
  }

  public leaveRoom(): void {
    this.backend.leaveRoom(this.room.roomId, this.room.you.userId);
  }

  public async rejoinRoom(): Promise<void> {
    var json: string = await this.backend.rejoinRoom(this.room.roomId, this.room.you.userId);
    if (json == "ROOM_DOES_NOT_EXIST" || json == "USER_DOES_NOT_EXIST") {
      this.room.roomId = null;
      this.room.you.userId = null;
      return;
    }

    var data = JSON.parse(json);
    this.room.you.username = data.Name;
    this.room.you.selectedCard = data.SelectedCard;
    this.room.you.isAdmin = data.IsAdmin;
    this.room.cardsRevealed = data.CardsRevealed;
    this.room.cards = data.CardDeck.split(',');
    this.room.playedCards = data.PlayedCards;
  }

  public selectCard(selectedCard: number): void {
    // Deselect card if the user clicks the same card again
    if (selectedCard == this.room.you.selectedCard)
      this.room.you.selectedCard = -1;
    else
      this.room.you.selectedCard = selectedCard;

    this.backend.selectCard(this.room.roomId, this.room.you.userId, this.room.you.selectedCard);
  }

  public revealCards(): void {
    this.backend.revealCards(this.room.roomId);
  }

  public resetCards(): void {
    this.backend.resetCards(this.room.roomId);
  }
}
