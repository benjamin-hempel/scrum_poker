import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private roomService: RoomService, private room: Room, private router: Router, private route: ActivatedRoute) {}

  // Displayed warnings?
  roomExistsWarning: boolean = false;
  connectionExistsWarning: boolean = false;
  noUsernameWarning: boolean = false;
  noRoomIdWarning: boolean = false;

  // User trying to join by link?
  joinByLink: boolean = false;

  // Get room ID from link
  ngOnInit() {
    let roomId = this.route.snapshot.paramMap.get("rid");
    if (roomId != null) {
      (<HTMLInputElement>document.getElementById("roomID")).value = roomId;
      this.joinByLink = true;
    }
  }

  // ----------
  // UI getters
  // ----------

  private getUsername(): string {
    let username: string;
    username = (<HTMLInputElement>document.getElementById("username")).value;
    username = username.trim();

    // Abort if no username was entered...
    if (username === "") {
      this.noUsernameWarning = true;
      return "USERNAME_IS_EMPTY";
    }

    // ...or hide warning and return username
    this.noUsernameWarning = false;
    return username;
  }

  private getRoomId(): string {
    let roomId: string;
    roomId = (<HTMLInputElement>document.getElementById("roomID")).value;
    roomId = roomId.trim();

    // Abort if no room ID was entered...
    if (roomId === "") {
      this.noRoomIdWarning = true;
      return "ROOMID_IS_EMPTY";
    }

    //...or hide warning and return room ID
    this.noRoomIdWarning = false;
    return roomId;
  }

  private getCardDeck(): string {
    // Check if a custom card deck was entered...
    let cardDeck = (<HTMLInputElement>document.getElementById("customCardDeck")).value;
    cardDeck = cardDeck.trim();

    //...if not, use currently selected predefined deck
    if (cardDeck === "") {
      cardDeck = (<HTMLInputElement>document.getElementById("predefinedCardDecks")).value;
    }

    return cardDeck;
  }

  // ----------------
  // Button callbacks
  // ----------------

  async createRoom() {
    // Abort if no username was entered
    let username = this.getUsername();
    if (username == "USERNAME_IS_EMPTY") return;

    let allUsersAreAdmins = (<HTMLInputElement>document.getElementById("allUsersAreAdmins")).checked;
    let cardDeck = this.getCardDeck();

    // Create and join room
    await this.roomService.createRoom(cardDeck, allUsersAreAdmins);
    await this.roomService.joinRoom(username);

    // Navigate to room page
    this.router.navigate(["/room", { rid: this.room.roomId, uid: this.room.you.userId }]);
  }

  async joinRoom() {
    // Abort if no username or room ID was entered
    let username = this.getUsername();
    if (username == "USERNAME_IS_EMPTY") return;
    let roomId = this.getRoomId();
    if (roomId == "ROOMID_IS_EMPTY") return;

    // Try joining room
    let result = await this.roomService.joinRoom(username, roomId);

    switch (result) {
      // Success: Hide warnings, get room users and navigate to room page
      case "JOIN_SUCCESSFUL":
        this.roomExistsWarning = false;
        this.connectionExistsWarning = false;
        await this.roomService.getUsers();
        this.router.navigate(["/room", { rid: this.room.roomId, uid: this.room.you.userId }]);
        break;

      // Room with specified ID does not exist
      case "ROOM_DOES_NOT_EXIST":
        this.roomExistsWarning = true;
        break;

      // User's connection ID at the hub already exists in the room
      case "CONNECTION_ALREADY_EXISTS":
        this.connectionExistsWarning = true;
        break;
    }
  }
}
