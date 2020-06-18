import { User } from './user';

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

  public removeUser(userId: string) {
    var index: number = this.users.findIndex(user => user.userId == userId);
    this.users.splice(index, 1);
  }

  public getUserById(userId: string): User {
    return this.users.find(user => user.userId == userId);
  }
}
