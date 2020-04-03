import { Component } from '@angular/core';

import { cards } from '../cards';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-room-component',
  templateUrl: './room.component.html'
})
export class RoomComponent {
  constructor(private roomService: RoomService) {}
  cards = cards;
}
