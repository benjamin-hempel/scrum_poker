using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace scrum_poker
{
    public class Room
    {
        public string Id { get; set; }
        public List<User> Users { get; set; }

        public Room()
        {
            Id = Guid.NewGuid().ToString();
            Users = new List<User>();
        }

        public string AddUser(string username)
        {
            User newUser = new User(username);
            Users.Add(newUser);

            return newUser.Id;
        }

        public void RemoveUser(string userId)
        {
            User userToRemove = Users.Find(x => x.Id == userId);
            Users.Remove(userToRemove);
        }

        public User GetUser(string userId)
        {
            return Users.Find(x => x.Id == userId);
        }
    }
}
