import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RoomService } from '../services/room.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private roomService: RoomService, private router: Router) {}

  async createRoom() {
    let username: string;
    username = (<HTMLInputElement> document.getElementById("username")).value;
    if (username === "") return;

    await this.roomService.createRoom();
    await this.roomService.joinRoom(username);
    this.router.navigateByUrl("/room");
  }

  async joinRoom() {
    let username: string;
    let roomId: string;

    username = (<HTMLInputElement>document.getElementById("username")).value;
    if (username === "") return;

    roomId = (<HTMLInputElement>document.getElementById("roomID")).value;
    if (roomId === "") return;

    await this.roomService.joinRoom(username, roomId);
    this.router.navigateByUrl("/room");
  }
}
