import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RoomService } from '../services/room.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private roomService: RoomService, private router: Router, private route: ActivatedRoute) {}

  roomExistsWarning: boolean = false;
  connectionExistsWarning: boolean = false;
  noUsernameWarning: boolean = false;
  noRoomIdWarning: boolean = false;
  joinByLink: boolean = false;

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

    if (username === "") {
      this.noUsernameWarning = true;
      return "USERNAME_IS_EMPTY";
    }
    this.noUsernameWarning = false;

    return username;
  }

  private getRoomId(): string {
    let roomId: string;
    roomId = (<HTMLInputElement>document.getElementById("roomID")).value;
    roomId = roomId.trim();

    if (roomId === "") {
      this.noRoomIdWarning = true;
      return "ROOMID_IS_EMPTY";
    }
    this.noRoomIdWarning = false;

    return roomId;
  }

  // ---------------
  // On button click
  // ---------------

  async createRoom() {
    let username = this.getUsername();
    if (username == "USERNAME_IS_EMPTY") return;

    let allUsersAreAdmins = (<HTMLInputElement>document.getElementById("allUsersAreAdmins")).checked;
    let cardDeck = (<HTMLInputElement>document.getElementById("predefinedCardDecks")).value;

    await this.roomService.createRoom(cardDeck, allUsersAreAdmins);
    await this.roomService.joinRoom(username);

    this.router.navigate(["/room", { rid: this.roomService.roomId, uid: this.roomService.you.userId }]);
  }

  async joinRoom() {
    let username = this.getUsername();
    if (username == "USERNAME_IS_EMPTY") return;

    let roomId = this.getRoomId();
    if (roomId == "ROOMID_IS_EMPTY") return;

    let result = await this.roomService.joinRoom(username, roomId);
    switch (result) {
      case "JOIN_SUCCESSFUL":
        this.roomExistsWarning = false;
        this.connectionExistsWarning = false;
        await this.roomService.getUsers();
        this.router.navigate(["/room", { rid: this.roomService.roomId, uid: this.roomService.you.userId }]);
        break;

      case "ROOM_DOES_NOT_EXIST":
        this.roomExistsWarning = true;
        break;

      case "CONNECTION_ALREADY_EXISTS":
        this.connectionExistsWarning = true;
        break;
    }
  }
}
