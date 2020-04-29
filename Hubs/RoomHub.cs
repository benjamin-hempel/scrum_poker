using System;
using System.Collections.Generic;
using System.Timers;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.SignalR;

namespace scrum_poker.Hubs
{
    public class RoomHub : Hub
    {
        private static List<Room> Rooms = new List<Room>();
        
        public string CreateRoom(string cardDeck, bool allUsersAreAdmins)
        {
            Room newRoom = new Room(cardDeck, allUsersAreAdmins);
            Rooms.Add(newRoom);

            return newRoom.Id;
        }

        public string JoinRoom(string roomId, string username)
        {
            // Check if room exists
            bool roomExists = Rooms.Exists(x => x.Id == roomId);
            if (roomExists == false) 
                return "ROOM_DOES_NOT_EXIST";

            Room room = Rooms.Find(x => x.Id == roomId);
            User user = room.AddUser(username, Context.ConnectionId);

            if (user == null)
                return "CONNECTION_ALREADY_EXISTS";

            // Notify clients
            Clients.Clients(room.Connections).SendAsync("UserJoined", user.Id, user.Name, user.IsAdmin);

            var obj = new { Id = user.Id, IsAdmin = user.IsAdmin, CardDeck = room.CardDeck };
            return JsonSerializer.Serialize(obj);
        }

        public void LeaveRoom(string roomId, string userId)
        {
            Room room = Rooms.Find(x => x.Id == roomId);
            if (room == null) return;

            // Remove connection, but keep user data around for potential reconnect
            room.Connections.Remove(Context.ConnectionId);

            User user = room.GetUser(userId);
            if (user == null) return;
            user.MissingInAction = true;

            Timer removeUserTimer = new Timer(30000);
            removeUserTimer.Elapsed += (sender, e) => RemoveUserFromRoom(sender, e, room, user);
            removeUserTimer.AutoReset = false;
            removeUserTimer.Enabled = true;

            // Remove room if it's empty after 30 seconds
            if (room.GetUsers().Count == 0)
            {
                Timer removeRoomTimer = new Timer(30000);
                removeRoomTimer.Elapsed += (sender, e) => RemoveRoom(sender, e, room);
                removeRoomTimer.AutoReset = false;
                removeRoomTimer.Enabled = true;
            }
    
            // Notify clients
            Clients.Clients(room.Connections).SendAsync("UserLeft", userId);
        }

        /// <summary>
        /// Allows a user to rejoin a room, e.g. after a page reload or accidental page leave.
        /// </summary>
        /// <param name="roomId">The UUID of the room to rejoin.</param>
        /// <param name="userId">The UUID of the user that is rejoining.</param>
        /// <returns>
        /// ROOM_DOES_NOT_EXIST if the room with the specified UUID does not exist.
        /// USER_DOES_NOT_EXIST if the user with the specified UUID does not exist.
        /// The username, the user's selected card and whether the cards in the room are currently revealed as JSON.
        /// </returns>
        public string Rejoin(string roomId, string userId)
        {
            Room room = Rooms.Find(x => x.Id == roomId);
            if (room == null) return "ROOM_DOES_NOT_EXIST";

            // Mark user as active
            User user = room.GetUser(userId);
            if (user == null) return "USER_DOES_NOT_EXIST";
            user.MissingInAction = false;

            // Add connection
            room.Connections.Add(Context.ConnectionId);

            // Notify clients
            Clients.Clients(room.Connections).SendAsync("UserJoined", user.Id, user.Name, user.IsAdmin);           
            if(user.SelectedCard > -1) 
                Clients.Clients(room.Connections).SendAsync("CardSelected", user.Id, user.SelectedCard);

            var obj = new { Name = user.Name, SelectedCard = user.SelectedCard, CardsRevealed = room.CardsRevealed, IsAdmin = user.IsAdmin, CardDeck = room.CardDeck };
            return JsonSerializer.Serialize(obj);
        }

        public void SelectCard(string roomId, string userId, int selectedCard)
        {
            Room room = Rooms.Find(x => x.Id == roomId);

            // Update selection
            if (room == null) return;
            User callingUser = room.GetUser(userId);
            if (callingUser == null) return;
            callingUser.SelectedCard = selectedCard;

            // Notify clients
            Clients.Clients(room.Connections).SendAsync("CardSelected", userId, selectedCard);
        }

        public void RevealCards(string roomId)
        {
            Room room = Rooms.Find(x => x.Id == roomId);
            if (room == null) return;

            room.CardsRevealed = true;
            Clients.Clients(room.Connections).SendAsync("CardsRevealed");
        }

        public void ResetCards(string roomId)
        {
            Room room = Rooms.Find(x => x.Id == roomId);
            if (room == null) return;

            foreach (var user in room.GetUsers())
                user.SelectedCard = -1;

            room.CardsRevealed = false;
            Clients.Clients(room.Connections).SendAsync("CardsReset");
        }

        public string GetUsers(string roomId)
        {
            Room room = Rooms.Find(x => x.Id == roomId);
            if (room == null) return "ROOM_DOES_NOT_EXIST";
            List<User> users = room.GetUsers();

            // Use JSON for transport
            return JsonSerializer.Serialize(users);
        }

        #region TimerMethods

        private void RemoveUserFromRoom(Object source, ElapsedEventArgs e, Room room, User user)
        {
            // Check if user is still missing-in-action
            if (user.MissingInAction == true)
            {
                room.RemoveUser(user.Id);
            }
        }

        private void RemoveRoom(Object source, ElapsedEventArgs e, Room room)
        {
            // Check if room is still empty
            if (room.GetUsers().Count == 0)
            {
                Rooms.Remove(room);
            }
        }

        #endregion
    }
}
