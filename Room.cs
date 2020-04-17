using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace scrum_poker
{
    public class Room
    {
        private string Id { get; }
        private List<User> Users { get; }

        private List<string> Connections = new List<string>();

        public Room()
        {
            Id = Guid.NewGuid().ToString();
            Users = new List<User>();
        }

        public string GetID()
        {
            return Id;
        }

        public string AddUser(string username, string connectionId)
        {
            if (Connections.Contains(connectionId)) return "CONNECTION_ALREADY_EXISTS";
            Connections.Add(connectionId);

            User newUser = new User(username);
            Users.Add(newUser);

            return newUser.Id;
        }

        public void RemoveUser(string userId, string connectionId)
        {
            Connections.Remove(connectionId);

            User userToRemove = Users.Find(x => x.Id == userId);
            Users.Remove(userToRemove);
        }

        public User GetUser(string userId)
        {
            return Users.Find(x => x.Id == userId);
        }

        public List<User> GetUsers()
        {
            return Users;
        }

        public List<string> GetConnections()
        {
            return Connections;
        }
    }
}
