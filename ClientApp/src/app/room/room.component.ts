import { Component } from '@angular/core';

import { cards } from '../cards';

@Component({
  selector: 'app-room-component',
  templateUrl: './room.component.html'
})
export class RoomComponent {
  public currentCount = 0;
  cards = cards;

  public incrementCounter() {
    this.currentCount++;
  }
}
