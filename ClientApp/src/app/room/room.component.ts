import { Component } from '@angular/core';

@Component({
  selector: 'app-room-component',
  templateUrl: './room.component.html'
})
export class RoomComponent {
  public currentCount = 0;

  public incrementCounter() {
    this.currentCount++;
  }
}
