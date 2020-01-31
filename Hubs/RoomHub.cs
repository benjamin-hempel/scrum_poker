using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace scrum_poker.Hubs
{
    public class RoomHub : Hub
    {
        private static List<Room> Rooms = new List<Room>();
        private static Dictionary<string, string> Connections = new Dictionary<string, string>();

        public string CreateRoom()
        {
            Room newRoom = new Room();
            Rooms.Add(newRoom);

            return newRoom.Id;
        }

        public string JoinRoom(string roomId, string username)
        {
            bool roomExists = Rooms.Exists(x => x.Id == roomId);
            if (roomExists == false) return null;

            Room room = Rooms.Find(x => x.Id == roomId);
            string userId = room.AddUser(username);

            string connectionId = Context.ConnectionId;
            Connections.Add(connectionId, userId);

            return userId;
        }

        public void LeaveRoom(string roomId, string userId)
        {
            Room room = Rooms.Find(x => x.Id == roomId);
            room.RemoveUser(userId);

            string connectionId = Context.ConnectionId;
            Connections.Remove(connectionId);

            if (room.Users.Count == 0) Rooms.Remove(room);
        }
    }
}
