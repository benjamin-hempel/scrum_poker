import { Room } from '../models/room';
import { User } from '../models/user';

export class RoomCallbacks {
  constructor(private room: Room) {}

  public UserJoinedCallback(userId: string, username: string, isAdmin: boolean): void {
    this.room.addUser(userId, username, isAdmin);
  }

  public UserLeftCallback(userId: string): void {
    this.room.removeUser(userId);
  }

  public CardSelectedCallback(userId: string, selectedCard: number, playedCards?: number): void {
    var user: User = this.room.getUserById(userId);
    user.selectedCard = selectedCard;
    if(playedCards != null)
      this.room.playedCards = playedCards;
  }

  public CardsRevealedCallback(): void {
    this.room.cardsRevealed = true;
  }

  public CardsResetCallback(): void {
    this.room.you.selectedCard = -1;
    this.room.cardsRevealed = false;
    for (let user of this.room.users)
      user.selectedCard = -1;
  }
}
