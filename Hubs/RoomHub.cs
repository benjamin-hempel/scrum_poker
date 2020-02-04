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
            // Check if room exists
            bool roomExists = Rooms.Exists(x => x.Id == roomId);
            if (roomExists == false) return null;

            Room room = Rooms.Find(x => x.Id == roomId);
            string userId = room.AddUser(username);

            // Add connection associated with user
            string connectionId = Context.ConnectionId;
            Connections.Add(connectionId, userId);

            // Notify other clients
            List<string> roomUsers = new List<string>();
            foreach(var user in room.Users)
            {
                string roomUserId = user.Id;
                string roomUserConnectionId = Connections.First(x => x.Value == roomUserId).Key;
                if (roomUserId != userId) roomUsers.Add(roomUserConnectionId);
            }
            Clients.Clients(roomUsers).SendAsync("UserJoined", userId, username);

            return userId;
        }

        public void LeaveRoom(string roomId, string userId)
        {
            // Remove user from room
            Room room = Rooms.Find(x => x.Id == roomId);
            room.RemoveUser(userId);

            // Remove connection associated with user
            string connectionId = Context.ConnectionId;
            Connections.Remove(connectionId);

            // Remove room if it's empty
            if (room.Users.Count == 0)
            {
                Rooms.Remove(room);
                return;
            }

            // Notify other clients
            List<string> roomUsers = new List<string>();
            foreach (var user in room.Users)
            {
                string roomUserId = user.Id;
                string roomUserConnectionId = Connections.First(x => x.Value == roomUserId).Key;
                if (roomUserId != userId) roomUsers.Add(roomUserConnectionId);
            }
            Clients.Clients(roomUsers).SendAsync("UserLeft", userId);
        }

        public void SelectCard(string roomId, string userId, int selectedCard)
        {
            Room room = Rooms.Find(x => x.Id == roomId);
            User callingUser = room.GetUser(userId);

            // Update selection and determine if a card is selected
            callingUser.SelectedCard = selectedCard;
            bool cardSelected = false;
            if (selectedCard >= 0) cardSelected = true;

            // Notify other clients
            List<string> roomUsers = new List<string>();
            foreach (var user in room.Users)
            {
                string roomUserId = user.Id;
                string roomUserConnectionId = Connections.First(x => x.Value == roomUserId).Key;
                if (roomUserId != userId) roomUsers.Add(roomUserConnectionId);
            }
            Clients.Clients(roomUsers).SendAsync("CardSelected", userId, cardSelected);
        }

        public void RevealCards(string roomId)
        {
            Room room = Rooms.Find(x => x.Id == roomId);

            // Send selected cards to all clients
            List<string> roomUsers = new List<string>();
            foreach (var user in room.Users)
            {
                string roomUserId = user.Id;
                string roomUserConnectionId = Connections.First(x => x.Value == roomUserId).Key;
                roomUsers.Add(roomUserConnectionId);                          
            }
            foreach (var user in room.Users)
            {
                string roomUserId = user.Id;
                int selectedCard = user.SelectedCard;
                Clients.Clients(roomUsers).SendAsync("CardRevealed", roomUserId, selectedCard);
            }
        }

        public void ResetCards(string roomId)
        {
            Room room = Rooms.Find(x => x.Id == roomId);

            // Notify all clients
            List<string> roomUsers = new List<string>();
            foreach (var user in room.Users)
            {
                string roomUserId = user.Id;
                user.SelectedCard = -1;
                string roomUserConnectionId = Connections.First(x => x.Value == roomUserId).Key;
                roomUsers.Add(roomUserConnectionId);
            }
            Clients.Clients(roomUsers).SendAsync("CardsReset");
        }
    }
}
