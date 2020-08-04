using System;
using System.Collections.Generic;

namespace scrum_poker.Models
{
    public class Room
    {
        /// <summary>
        /// The unique identifier (GUID) of the room.
        /// </summary>
        public string Id { get; private set; }

        /// <summary>
        /// A list of all users that are currently in the room or missing in action.
        /// </summary>
        private List<User> Users { get; set; }

        /// <summary>
        /// A list of the connection IDs of all users that are currently in the room.
        /// </summary>
        public List<string> Connections { get; private set; }

        /// <summary>
        /// Determines whether or not the selected cards are currently revealed to the users.
        /// </summary>
        public bool CardsRevealed { get; set; }

        /// <summary>
        /// The amount of cards that have been played in this room so far.
        /// </summary>
        public int PlayedCards { get; set; }

        /// <summary>
        /// Determines whether or not all users joining the room shall be made administrators.
        /// </summary>
        public bool AllUsersAreAdmins { get; private set; }

        /// <summary>
        /// A comma-separated string representing the card deck that is used for this room.
        /// </summary>
        public string CardDeck { get; private set; }

        /// <summary>
        /// Instantiates and initializes a new room object with a unique identifier (GUID).
        /// </summary>
        /// <param name="cardDeck">A comma-separated string representing the card deck to use for this room.</param>
        /// <param name="allUsersAreAdmins">Whether or not all users joining the room shall be made administrators.</param>
        public Room(string cardDeck, bool allUsersAreAdmins = false)
        {
            // Initialize/set room data
            Id = Guid.NewGuid().ToString();
            Users = new List<User>();
            Connections = new List<string>();
            CardsRevealed = false;
            PlayedCards = 0;
            AllUsersAreAdmins = allUsersAreAdmins;
            CardDeck = cardDeck;
        }

        /// <summary>
        /// Adds a user to this room.
        /// </summary>
        /// <param name="username">The (non-unique) username of the user to add.</param>
        /// <param name="connectionId">The connection ID of the user to add.</param>
        /// <returns>A user object representing the added user.</returns>
        public User AddUser(string username, string connectionId)
        {
            if (Connections.Contains(connectionId)) 
                return null;
            Connections.Add(connectionId);

            User newUser;

            // Make user admin if they are the creator or all users in the room shall be admins
            if(Users.Count == 0 || AllUsersAreAdmins == true)
                newUser = new User(username, true);
            else
                newUser = new User(username);
            
            Users.Add(newUser);

            return newUser;
        }

        /// <summary>
        /// Removes a user from this room.
        /// </summary>
        /// <param name="userId">The ID of the user to remove.</param>
        public void RemoveUser(string userId)
        {
            User userToRemove = Users.Find(x => x.Id == userId);
            if(userToRemove != null) 
                Users.Remove(userToRemove);
        }

        /// <summary>
        /// Get a single user from this room.
        /// </summary>
        /// <param name="userId">The ID of the desired user.</param>
        /// <returns>
        /// The user object representing the desired user.
        /// null if the user with the specified ID does not exist in this room.
        /// </returns>
        public User GetUser(string userId)
        {
            return Users.Find(x => x.Id == userId);
        }

        /// <summary>
        /// Get a list of all users in this room that are not missing in action.
        /// </summary>
        /// <returns>A list of all user objects representing the active users in this room.</returns>
        public List<User> GetActiveUsers()
        {
            return Users.FindAll(x => !x.MissingInAction);
        }

        /// <summary>
        /// Get a list of all users in this room, including ones missing in action.
        /// </summary>
        /// <returns>A list of all user objects.</returns>
        public List<User> GetAllUsers()
        {
            return Users;
        }
    }
}
