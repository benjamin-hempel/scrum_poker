import { v4 as uuidv4 } from 'uuid';

import { User } from '../user';

export class MockRoom {
  public id: string;
  public users: Array<User>;
  public cardsRevealed: boolean;
  public playedCards: number;
  public allUsersAreAdmins: boolean;
  public cardDeck: string;

  constructor(cardDeck: string, allUsersAreAdmins: boolean = false) {
    this.id = uuidv4();
    this.users = new Array<User>();
    this.cardsRevealed = false;
    this.allUsersAreAdmins = allUsersAreAdmins;
    this.cardDeck = cardDeck;
  }
}
