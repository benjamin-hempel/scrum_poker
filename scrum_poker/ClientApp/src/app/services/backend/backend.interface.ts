export interface BackendInterface {
  createRoom(cardDeck: string, allUsersAreAdmins: boolean): Promise<string>;
  joinRoom(username: string, roomId: string): Promise<string>;
  getUsers(roomId: string): Promise<string>;
  leaveRoom(roomId: string, userId: string): void;
  rejoinRoom(roomId: string, userId: string): Promise<string>;
  selectCard(roomId: string, userId: string, selectedCard: number): void;
  revealCards(roomId: string): void;
  resetCards(roomId: string): void;
}
