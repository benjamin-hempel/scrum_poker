using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace scrum_poker
{
    public class User
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int SelectedCard { get; set; }

        public User(string username)
        {
            Id = Guid.NewGuid().ToString();
            Name = username;
            SelectedCard = -1;
        }

        public void SelectCard(int cardIndex)
        {
            SelectedCard = cardIndex;
        }
    }
}
