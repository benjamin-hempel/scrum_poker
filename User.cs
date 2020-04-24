using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace scrum_poker
{
    public class User
    {
        public string Id { get; }
        public string Name { get; }
        public int SelectedCard { get; set; }
        public bool MissingInAction { get; set; }

        public User(string username)
        {
            Id = Guid.NewGuid().ToString();
            Name = username;
            SelectedCard = -1;
            MissingInAction = false;
        }
    }
}
