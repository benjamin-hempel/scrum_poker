import { Component, HostListener } from '@angular/core';

import { cards } from '../cards';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-room-component',
  templateUrl: './room.component.html'
})
export class RoomComponent {
  constructor(private roomService: RoomService) {}
  cards = cards;

  async selectCard(index: number) {
    await this.roomService.selectCard(index);
  }

  @HostListener('window:beforeunload')
  leaveRoom() {
    this.roomService.leaveRoom();
  }

}
