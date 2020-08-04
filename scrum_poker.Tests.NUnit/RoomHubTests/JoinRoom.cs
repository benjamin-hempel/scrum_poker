using System;
using System.Text.Json;
using NUnit.Framework;
using Microsoft.AspNetCore.SignalR;
using Moq;

namespace scrum_poker.Tests.NUnit.RoomHubTests
{
    class JoinRoom
    {
        private Hubs.RoomHub roomHub = new Hubs.RoomHub();

        private Mock<HubCallerContext> hubCallerContext = new Mock<HubCallerContext>();
        private Mock<IHubCallerClients> hubCallerClients = new Mock<IHubCallerClients>();

        private void UpdateConnectionId()
        {
            hubCallerContext.Setup(c => c.ConnectionId).Returns(Guid.NewGuid().ToString());
            roomHub.Context = hubCallerContext.Object;
        }

        [SetUp]
        public void SetUp()
        {
            roomHub.Clients = hubCallerClients.Object;
        }

        [Test]
        public void SingleUserJoinsSingleRoom()
        {
            string roomId = roomHub.CreateRoom("1,2,3,4,5,6", false);
            UpdateConnectionId();
            string jsonJimHopper = roomHub.JoinRoom(roomId, "Jim Hopper");

            var room = Hubs.RoomHub.Rooms[0];
            int actualUserCount = room.GetActiveUsers().Count;
            Assert.AreEqual(1, actualUserCount, "The room should contain 1 user");

            try
            {
                JsonSerializer.Deserialize<object>(jsonJimHopper);
            }
            catch (JsonException)
            {
                Assert.Fail("The user's return value is not valid JSON");
            }
        }

        [Test]
        public void MultipleUsersJoinSingleRoom()
        {
            string roomId = roomHub.CreateRoom("1,2,3,4,5,6", false);
            UpdateConnectionId();
            string jsonJimHopper = roomHub.JoinRoom(roomId, "Jim Hopper");
            UpdateConnectionId();
            string jsonJaneHopper = roomHub.JoinRoom(roomId, "Jane Hopper");
            UpdateConnectionId();
            string jsonJoyceByers = roomHub.JoinRoom(roomId, "Joyce Byers");

            var room = Hubs.RoomHub.Rooms[0];
            int actualUserCount = room.GetActiveUsers().Count;
            Assert.AreEqual(3, actualUserCount, "The room should contain 3 users");

            try
            {
                JsonSerializer.Deserialize<object>(jsonJimHopper);
                JsonSerializer.Deserialize<object>(jsonJaneHopper);
                JsonSerializer.Deserialize<object>(jsonJoyceByers);
            }
            catch (JsonException)
            {
                Assert.Fail("One of the users' return values is not valid JSON");
            }
        }

        [Test]
        public void MultipleUsersJoinMultipleRooms()
        {
            string room1Id = roomHub.CreateRoom("1,2,3,4,5,6", false);
            string room2Id = roomHub.CreateRoom("1,2,3,4,5,6", false);

            UpdateConnectionId();
            string jsonJimHopper = roomHub.JoinRoom(room1Id, "Jim Hopper");
            UpdateConnectionId();
            string jsonJaneHopper = roomHub.JoinRoom(room1Id, "Jane Hopper");
            UpdateConnectionId();
            string jsonJoyceByers = roomHub.JoinRoom(room2Id, "Joyce Byers");

            var room1 = Hubs.RoomHub.Rooms[0];
            int actualUserCount1 = room1.GetActiveUsers().Count;
            Assert.AreEqual(2, actualUserCount1, "Room 1 should contain 2 users");
            var room2 = Hubs.RoomHub.Rooms[1];
            int actualUserCount2 = room2.GetActiveUsers().Count;
            Assert.AreEqual(1, actualUserCount2, "Room 2 should contain 1 user");

            try
            {
                JsonSerializer.Deserialize<object>(jsonJimHopper);
                JsonSerializer.Deserialize<object>(jsonJaneHopper);
                JsonSerializer.Deserialize<object>(jsonJoyceByers);
            }
            catch (JsonException)
            {
                Assert.Fail("One of the users' return values is not valid JSON");
            }
        }

        [Test]
        public void UserTriesJoiningNonExistingRoom()
        {
            roomHub.CreateRoom("1,2,3,4,5,6", false);
            string jsonJimHopper = roomHub.JoinRoom("OldMacdonaldHadAFarm", "Jim Hopper");

            var room = Hubs.RoomHub.Rooms[0];
            int actualUserCount = room.GetActiveUsers().Count;
            Assert.AreEqual(0, actualUserCount, "The room should contain 0 users");
            Assert.AreEqual("ROOM_DOES_NOT_EXIST", jsonJimHopper, "The hub should have returned ROOM_DOES_NOT_EXIST");
        }

        [TearDown]
        public void TearDown()
        {
            Hubs.RoomHub.Rooms.RemoveRange(0, Hubs.RoomHub.Rooms.Count);
        }
    }
}
