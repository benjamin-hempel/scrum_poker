using System;
using System.Collections.Generic;

namespace scrum_poker.Models
{
    public class Room
    {
        public string Id { get; private set; }
        private List<User> Users { get; set; }
        public List<string> Connections { get; private set; }
        public bool CardsRevealed { get; set; }
        public int PlayedCards { get; set; }
        public bool AllUsersAreAdmins { get; private set; }
        public string CardDeck { get; private set; }

        public Room(string cardDeck, bool allUsersAreAdmins)
        {
            // Initialize/set room data
            Id = Guid.NewGuid().ToString();
            Users = new List<User>();
            Connections = new List<string>();
            CardsRevealed = false;
            AllUsersAreAdmins = allUsersAreAdmins;
            CardDeck = cardDeck;
        }

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

        public void RemoveUser(string userId)
        {
            User userToRemove = Users.Find(x => x.Id == userId);
            if(userToRemove != null) 
                Users.Remove(userToRemove);
        }

        public User GetUser(string userId)
        {
            return Users.Find(x => x.Id == userId);
        }

        public List<User> GetUsers()
        {
            return Users.FindAll(x => !x.MissingInAction);
        }
    }
}
