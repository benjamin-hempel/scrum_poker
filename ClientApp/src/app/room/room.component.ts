import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';

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
    this.roomService.you.userId = this.route.snapshot.paramMap.get("uid");
    this.joinUrl = window.location.protocol + "//" + window.location.host + "/" + this.roomService.roomId;
  }

  faShieldAlt = faShieldAlt;

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

