import { v4 as uuidv4 } from 'uuid';

/* This is the TypeScript equivalent of the backend's User class */
export class MockUser {
  public id: string;
  public name: string;
  public selectedCard: number;
  public isAdmin: boolean;
  public missingInAction: boolean;

  constructor(username: string, isAdmin: boolean = false) {
    this.id = uuidv4();
    this.name = username;
    this.selectedCard = -1;
    this.missingInAction = false;
    this.isAdmin = isAdmin;
  }
}
