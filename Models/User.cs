using System;

namespace scrum_poker.Models
{
    public class User
    {
        /// <summary>
        /// The unique identifier (GUID) of this user.
        /// </summary>
        public string Id { get; private set; }

        /// <summary>
        /// The username of this user.
        /// </summary>
        public string Name { get; private set; }

        /// <summary>
        /// The index of the card currently selected by this user.
        /// </summary>
        public int SelectedCard { get; set; }

        /// <summary>
        /// Whether or not this user in an administrator in their room.
        /// </summary>
        public bool IsAdmin { get; private set; }

        /// <summary>
        /// Whether or not this user has left their room, but is still in the rejoin window.
        /// </summary>
        public bool MissingInAction { get; set; }

        /// <summary>
        /// Instantiates and initializes a new user object.
        /// </summary>
        /// <param name="username">The (non-unique) username the user.</param>
        /// <param name="isAdmin">Whether or not this user will be an administrator in their room.</param>
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
