import { v4 as uuidv4 } from 'uuid';

import { MockUser } from './mock-user';

/* This is the TypeScript equivalent of the backend's Room class, sans connection management */
export class MockRoom {
  public id: string;
  public users: Array<MockUser>;
  public cardsRevealed: boolean;
  public playedCards: number;
  public allUsersAreAdmins: boolean;
  public cardDeck: string;

  constructor(cardDeck: string, allUsersAreAdmins: boolean = false) {
    this.id = uuidv4();
    this.users = new Array<MockUser>();
    this.cardsRevealed = false;
    this.allUsersAreAdmins = allUsersAreAdmins;
    this.cardDeck = cardDeck;
  }

  public addUser(username: string): MockUser {
    var newUser: MockUser;

    if (this.users.length == 0 || this.allUsersAreAdmins == true)
      newUser = new MockUser(username, true);
    else
      newUser = new MockUser(username);

    this.users.push(newUser);

    return newUser;
  }

  public removeUser(userId: string): void {
    var userToRemove: number = this.users.findIndex(x => x.id == userId);
    this.users.splice(userToRemove, 1);
  }

  public getUser(userId: string): MockUser {
    return this.users.find(x => x.id == userId);
  }

  public getActiveUsers(): Array<MockUser> {
    return this.users.filter(x => !x.missingInAction);
  }
  public getAllUsers(): Array<MockUser> {
    return this.users;
  }
}
