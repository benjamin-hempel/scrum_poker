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
        

        public string CreateRoom()
        {
            Room newRoom = new Room();
            Rooms.Add(newRoom);

            return newRoom.GetID();
        }

        public string JoinRoom(string roomId, string username)
        {
            // Check if room exists
            bool roomExists = Rooms.Exists(x => x.GetID() == roomId);
            if (roomExists == false) return "ROOM_DOES_NOT_EXIST";

            Room room = Rooms.Find(x => x.GetID() == roomId);
            string userId = room.AddUser(username, Context.ConnectionId);

            // Notify clients
            Clients.Clients(room.GetConnections()).SendAsync("UserJoined", userId, username);

            return userId;
        }

        public void LeaveRoom(string roomId, string userId)
        {
            // Remove user from room
            Room room = Rooms.Find(x => x.GetID() == roomId);
            room.RemoveUser(userId, Context.ConnectionId);

            // Remove room if it's empty
            if (room.GetUsers().Count == 0)
            {
                Rooms.Remove(room);
                return;
            }

            // Notify clients
            Clients.Clients(room.GetConnections()).SendAsync("UserLeft", userId);
        }

        public void SelectCard(string roomId, string userId, int selectedCard)
        {
            Room room = Rooms.Find(x => x.GetID() == roomId);

            // Update selection
            User callingUser = room.GetUser(userId);
            callingUser.SelectedCard = selectedCard;

            // Notify clients
            Clients.Clients(room.GetConnections()).SendAsync("CardSelected", userId, selectedCard);
        }

        public void RevealCards(string roomId)
        {
            Room room = Rooms.Find(x => x.GetID() == roomId);

            Clients.Clients(room.GetConnections()).SendAsync("CardsRevealed");
        }

        public void ResetCards(string roomId)
        {
            Room room = Rooms.Find(x => x.GetID() == roomId);

            Clients.Clients(room.GetConnections()).SendAsync("CardsReset");
        }
    }
}
