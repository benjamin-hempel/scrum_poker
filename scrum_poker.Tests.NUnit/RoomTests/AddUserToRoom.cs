using System.Collections.Generic;
using NUnit.Framework;

namespace scrum_poker.Tests.NUnit.RoomTests
{
    class AddUserToRoom
    {
        [SetUp]
        public void SetUp()
        {

        }

        [Test]
        public void AddUsersToRoom()
        {
            var room = new Models.Room("1,2,3,4,5,6");
            room.AddUser("Jim Hopper", "1");
            room.AddUser("Jane Hopper", "2");

            int actualUserCount = room.GetAllUsers().Count;
            Assert.AreEqual(2, actualUserCount, "The room should contain 2 users");
            int actualConnectionCount = room.Connections.Count;
            Assert.AreEqual(2, actualConnectionCount, "The room should contain 2 connections");

            var firstUser = room.GetAllUsers()[0];
            Assert.IsTrue(firstUser.IsAdmin, "The first user in the room should be administrator");
        }

        [Test]
        public void AddUsersToAllAdminRoom()
        {
            var room = new Models.Room("1,2,3,4,5,6", true);
            room.AddUser("Jim Hopper", "1");
            room.AddUser("Jane Hopper", "2");

            int actualUserCount = room.GetAllUsers().Count;
            Assert.AreEqual(2, actualUserCount, "The room should contain 2 users");
            int actualConnectionCount = room.Connections.Count;
            Assert.AreEqual(2, actualConnectionCount, "The room should contain 2 connections");

            List<Models.User> users = room.GetAllUsers();
            foreach (var user in users)
                Assert.IsTrue(user.IsAdmin, "All users in the room should be administrator");
        }

        [Test]
        public void AddUsersWithSameConnectionId()
        {
            var room = new Models.Room("1,2,3,4,5,6");
            room.AddUser("Jim Hopper", "1");
            room.AddUser("Jane Hopper", "1");

            int actualUserCount = room.GetAllUsers().Count;
            Assert.AreEqual(1, actualUserCount, "The room should contain 1 user");
            int actualConnectionCount = room.Connections.Count;
            Assert.AreEqual(1, actualConnectionCount, "The room should contain 1 connection");
        }
    }
}
