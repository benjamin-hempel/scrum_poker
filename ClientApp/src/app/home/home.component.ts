import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RoomService } from '../services/room.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private roomService: RoomService, private router: Router) {}

  roomExistsWarning: boolean = false;
  noUsernameWarning: boolean = false;
  noRoomIdWarning: boolean = false;

  private getUsername(): string {
    let username: string;
    username = (<HTMLInputElement>document.getElementById("username")).value;
    username = username.trim();

    if (username === "") {
      this.noUsernameWarning = true;
      return "USERNAME_IS_EMPTY";
    }
    this.noUsernameWarning = false;
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
  }

  async createRoom() {
    let username = this.getUsername();
    if (username == "USERNAME_IS_EMPTY") return;

    await this.roomService.createRoom();
    await this.roomService.joinRoom(username);
    this.router.navigateByUrl("/room");
  }

  async joinRoom() {
    let username = this.getUsername();
    if (username == "USERNAME_IS_EMPTY") return;

    let roomId = this.getRoomId();
    if (roomId == "ROOMID_IS_EMPTY") return;

    let result = await this.roomService.joinRoom(username, roomId);
    if (result == true) {
      this.roomExistsWarning = false;
      await this.roomService.getUsers();
      this.router.navigateByUrl("/room");
    } else {
      this.roomExistsWarning = true;
    }
  }
}
