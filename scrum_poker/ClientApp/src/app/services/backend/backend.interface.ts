interface BackendInterface {
  createConnection(): void;
  registerCallbacks(): void;
  startConnection(): void;

  createRoom(cardDeck: string, allUsersAreAdmins: boolean): void;
  joinRoom(username: string, roomId: string): Promise<string>;
  getUsers(): void;
  leaveRoom(): void;
  rejoinRoom(): void;
  selectCard(selectedCard: number);
  revealCards(): void;
  resetCards(): void;
}
