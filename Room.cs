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
    }
}
