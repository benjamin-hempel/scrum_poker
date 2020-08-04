import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Icons
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';

import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room-component',
  templateUrl: './room.component.html'
})
export class RoomComponent implements OnInit {
  constructor(public roomService: RoomService, public room: Room, private route: ActivatedRoute) { }

  joinUrl: string; 

  ngOnInit() {
    // Get room and user ID for potential rejoin
    this.route.paramMap.subscribe(params => {
      this.room.roomId = params.get('rid');
      this.room.you.userId = params.get('uid');

      // Build join URL
      this.joinUrl = window.location.protocol + "//" + window.location.host + "/" + this.room.roomId;
    });
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

  // Automatically leave if the user closes the tab
  @HostListener('window:beforeunload')
  async leaveRoom() {
    await this.roomService.leaveRoom();
  }

}

