import * as signalR from "@aspnet/signalr";

import { RoomService } from '../services/room.service';

describe('RoomService', () => {
  let service: RoomService;
  beforeEach(() => { service = new RoomService(); });

  it('should be connected to the SignalR hub', () => {
    let hubConnection = service.getHubConnection();
    expect(hubConnection.state).toBe(1);
  });
});
