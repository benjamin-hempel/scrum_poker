using System;

namespace scrum_poker.Models
{
    public class User
    {
        public string Id { get; private set; }
        public string Name { get; private set; }
        public int SelectedCard { get; set; }
        public bool IsAdmin { get; private set; }
        public bool MissingInAction { get; set; }

        public User(string username, bool isAdmin = false)
        {
            // Initialize/set user data
            Id = Guid.NewGuid().ToString();
            Name = username;
            SelectedCard = -1;
            MissingInAction = false;
            IsAdmin = isAdmin;
        }
    }
}
