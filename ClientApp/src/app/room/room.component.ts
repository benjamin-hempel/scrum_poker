import { Component, HostListener } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { cards } from '../cards';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-room-component',
  templateUrl: './room.component.html'
})
export class RoomComponent {
  constructor(private roomService: RoomService, private route: ActivatedRoute) { }

  joinUrl: string; 

  ngOnInit() {
    this.roomService.roomId = this.route.snapshot.paramMap.get("rid");
    this.roomService.userId = this.route.snapshot.paramMap.get("uid");
    this.joinUrl = window.location.protocol + "//" + window.location.host + "/" + this.roomService.roomId;
  }

  cards = cards;

  async selectCard(index: number) {
    await this.roomService.selectCard(index);
  }

  async revealCards() {
    await this.roomService.revealCards();
  }

  async resetCards() {
    await this.roomService.resetCards();
  }

  @HostListener('window:beforeunload')
  async leaveRoom() {
    await this.roomService.leaveRoom();
  }

}
