export interface BackendInterface {
  createRoom(cardDeck: string, allUsersAreAdmins: boolean): string | Promise<string>;
  joinRoom(username: string, roomId: string): string | Promise<string>;
  getUsers(roomId: string): string | Promise<string>;
  leaveRoom(roomId: string, userId: string): void;
  rejoinRoom(roomId: string, userId: string): string | Promise<string>;
  selectCard(roomId: string, userId: string, selectedCard: number): void;
  revealCards(roomId: string): void;
  resetCards(roomId: string): void;
}
