import { Injectable } from '@angular/core';

import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class Room {
  roomId: string;
  cardsRevealed: boolean = false;
  playedCards: number = 0;
  cards: string[];
  you: User = new User();
  users: Array<User> = new Array<User>();

  public addUser(userId: string, username: string, isAdmin: boolean, selectedCard: number = -1) {
    var newUser = new User();

    newUser.userId = userId;
    newUser.username = username;
    newUser.selectedCard = selectedCard;
    newUser.isAdmin = isAdmin;

    this.users.push(newUser);
  }
}
