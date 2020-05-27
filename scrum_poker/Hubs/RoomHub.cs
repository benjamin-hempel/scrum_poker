using System;
using System.Collections.Generic;
using System.Timers;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using scrum_poker.Models;

namespace scrum_poker.Hubs
{
    public class RoomHub : Hub
    {
        public static List<Room> Rooms { get; private set; } = new List<Room>();

        /// <summary>
        /// Creates a new room.
        /// </summary>
        /// <param name="cardDeck">The comma-separated card deck to use for the room.</param>
        /// <param name="allUsersAreAdmins">Determines whether or not all users joining the room shall be administrators.</param>
        /// <returns>The ID of the newly created room.</returns>
        public string CreateRoom(string cardDeck, bool allUsersAreAdmins)
        {
            Room newRoom = new Room(cardDeck, allUsersAreAdmins);
            Rooms.Add(newRoom);

            return newRoom.Id;
        }

        /// <summary>
        /// Join an existing room.
        /// Notifies all clients that the user has joined the room.
        /// </summary>
        /// <param name="roomId">The ID of the room to join.</param>
        /// <param name="username">The (non-unique) username of the joining user.</param>
        /// <returns>
        /// A JSON string containing information about the room if joining was successful.
        /// "ROOM_DOES_NOT_EXIST" if the room with the specified ID does not exist.
        /// "CONNECTION_ALREADY_EXISTS" if the connection ID of the joining user is already associated with the specified room.
        /// </returns>
        public string JoinRoom(string roomId, string username)
        {   
            Room room = Rooms.Find(x => x.Id == roomId);
            if (room == null) 
                return "ROOM_DOES_NOT_EXIST";

            User user = room.AddUser(username, Context.ConnectionId);
            if (user == null)
                return "CONNECTION_ALREADY_EXISTS";

            // Notify clients
            var clients = Clients.Clients(room.Connections);
            if(clients != null)
            {
                clients.SendAsync("UserJoined", user.Id, user.Name, user.IsAdmin);
            }
            
            // Serialize and return room data
            var obj = new { Id = user.Id, IsAdmin = user.IsAdmin, CardDeck = room.CardDeck, CardsRevealed = room.CardsRevealed, PlayedCards = room.PlayedCards };
            return JsonSerializer.Serialize(obj);
        }

        /// <summary>
        /// Leave an existing room. 
        /// Notifies all clients that the user left the room.
        /// User data is kept around for 30 seconds for a potential rejoin.
        /// If the room is empty after the user left, room data is kept around for 30 seconds for a potential rejoin.
        /// After that, the room and its data will be removed.
        /// </summary>
        /// <param name="roomId">The ID of the room to leave.</param>
        /// <param name="userId">The ID of the user that is leaving the room.</param>
        public void LeaveRoom(string roomId, string userId)
        {
            Room room = Rooms.Find(x => x.Id == roomId);
            if (room == null) 
                return;

            // Remove connection, but keep user data around for potential reconnect
            room.Connections.Remove(Context.ConnectionId);

            User user = room.GetUser(userId);
            if (user == null) return;
            user.MissingInAction = true;

            // Delete user data if they haven't rejoined after 30 seconds
            Timer removeUserTimer = new Timer(30000);
            removeUserTimer.Elapsed += (sender, e) => RemoveUserFromRoom(sender, e, room, user);
            removeUserTimer.AutoReset = false;
            removeUserTimer.Enabled = true;

            // Remove room if it's empty after 30 seconds
            if (room.GetActiveUsers().Count == 0)
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
        /// Rejoin an existing room, given the room and user data still exist.
        /// Notifies all clients that the user has rejoined and sends all data necessary to rebuild the state before the user left.
        /// </summary>
        /// <param name="roomId">The ID of the room to rejoin.</param>
        /// <param name="userId">The ID of the user that is rejoining.</param>
        /// <returns>
        /// A JSON string containing information about the user and room if rejoining was successful.
        /// "ROOM_DOES_NOT_EXIST" if the room with the specified ID does not exist (anymore).
        /// "USER_DOES_NOT_EXIST" if the user with the specified ID does not exist (anymore).
        /// </returns>
        public string Rejoin(string roomId, string userId)
        {
            Room room = Rooms.Find(x => x.Id == roomId);
            if (room == null) 
                return "ROOM_DOES_NOT_EXIST";

            // Mark user as active
            User user = room.GetUser(userId);
            if (user == null) 
                return "USER_DOES_NOT_EXIST";
            user.MissingInAction = false;

            // Add connection
            room.Connections.Add(Context.ConnectionId);

            // Notify clients
            Clients.Clients(room.Connections).SendAsync("UserJoined", user.Id, user.Name, user.IsAdmin);           
            if(user.SelectedCard > -1) 
                Clients.Clients(room.Connections).SendAsync("CardSelected", user.Id, user.SelectedCard);

            // Serialize and return room data
            var obj = new { Name = user.Name, SelectedCard = user.SelectedCard, CardsRevealed = room.CardsRevealed, IsAdmin = user.IsAdmin, CardDeck = room.CardDeck, PlayedCards = room.PlayedCards };
            return JsonSerializer.Serialize(obj);
        }

        /// <summary>
        /// Handles a user selecting a card. Sends the selected card as well as the current played cards counter to all clients in the room.
        /// </summary>
        /// <param name="roomId">The ID of the room the user is in.</param>
        /// <param name="userId">The ID of the user selecting the card.</param>
        /// <param name="selectedCard">The index of the card the user has selected.</param>
        public void SelectCard(string roomId, string userId, int selectedCard)
        {
            Room room = Rooms.Find(x => x.Id == roomId);
            if (room == null) 
                return;

            User user = room.GetUser(userId);
            if (user == null) 
                return;

            // Update played card counter
            if (user.SelectedCard == -1)
                room.PlayedCards++;
            if (selectedCard == -1)
                room.PlayedCards--;

            // Update selection
            user.SelectedCard = selectedCard;

            // Notify clients
            Clients.Clients(room.Connections).SendAsync("CardSelected", user.Id, user.SelectedCard, room.PlayedCards);
        }

        /// <summary>
        /// Notifies all clients in the room that the selected cards have been revealed.
        /// </summary>
        /// <param name="roomId">The ID of the room to reveal the cards for.</param>
        public void RevealCards(string roomId)
        {
            Room room = Rooms.Find(x => x.Id == roomId);
            if (room == null) 
                return;

            room.CardsRevealed = true;

            // Notify clients
            Clients.Clients(room.Connections).SendAsync("CardsRevealed");
        }

        /// <summary>
        /// Notifies all clients in the room that all card selections have been reset.
        /// </summary>
        /// <param name="roomId">The ID of the room to reset the cards for.</param>
        public void ResetCards(string roomId)
        {
            Room room = Rooms.Find(x => x.Id == roomId);
            if (room == null) 
                return;

            foreach (var user in room.GetAllUsers())
                user.SelectedCard = -1;

            room.CardsRevealed = false;

            // Notify clients
            Clients.Clients(room.Connections).SendAsync("CardsReset");
        }

        /// <summary>
        /// Get all users in the specified room.
        /// </summary>
        /// <param name="roomId">The ID of the desired room.</param>
        /// <returns>
        /// A JSON string containing all data of users that are currently logged in.
        /// "ROOM_DOES_NOT_EXIST" if the room with the specified ID does not exist.
        /// </returns>
        public string GetUsers(string roomId)
        {
            Room room = Rooms.Find(x => x.Id == roomId);
            if (room == null) 
                return "ROOM_DOES_NOT_EXIST";

            // Get and serialize users
            List<User> users = room.GetActiveUsers();
            return JsonSerializer.Serialize(users);
        }

        #region TimerMethods

        /// <summary>
        /// Removes a user from the room if they haven't rejoined in the meantime.
        /// </summary>
        /// <param name="room">The room that the user shall be removed from.</param>
        /// <param name="user">The user to remove.</param>
        private void RemoveUserFromRoom(Object source, ElapsedEventArgs e, Room room, User user)
        {
            // Check if user is still missing in action
            if (user.MissingInAction == true)
                room.RemoveUser(user.Id);
        }

        /// <summary>
        /// Removes a room if no one has (re)joined in the meantime.
        /// </summary>
        /// <param name="room">The room to remove.</param>
        private void RemoveRoom(Object source, ElapsedEventArgs e, Room room)
        {
            // Check if room is still empty
            if (room.GetActiveUsers().Count == 0)
                Rooms.Remove(room);
        }

        #endregion
    }
}
