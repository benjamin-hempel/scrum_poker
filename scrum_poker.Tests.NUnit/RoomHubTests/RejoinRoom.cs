using System;
using System.Threading;
using System.Text.Json;
using NUnit.Framework;
using Microsoft.AspNetCore.SignalR;
using Moq;

namespace scrum_poker.Tests.NUnit.RoomHubTests
{
    class RejoinRoom
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
            roomHub.CreateRoom("1,2,3,4,5,6", false);
            roomHub.Clients = hubCallerClients.Object;
        }

        [Test]
        public void UserRejoinsRoomWithUsersLeft()
        {
            var room = Hubs.RoomHub.Rooms[0];
            string roomId = room.Id;

            UpdateConnectionId();
            roomHub.JoinRoom(roomId, "Jim Hopper");
            UpdateConnectionId();
            roomHub.JoinRoom(roomId, "Jane Hopper");
            UpdateConnectionId();
            roomHub.JoinRoom(roomId, "Joyce Byers");

            var janeHopper = room.GetAllUsers().Find(x => x.Name == "Jane Hopper");
            string janeHopperId = janeHopper.Id;
            roomHub.LeaveRoom(roomId, janeHopperId);

            int actualTotalUserCount = room.GetAllUsers().Count;
            Assert.AreEqual(3, actualTotalUserCount, "The room should have 3 total users");
            int actualActiveUserCount = room.GetActiveUsers().Count;
            Assert.AreEqual(2, actualActiveUserCount, "The room should have 2 active users");

            Thread.Sleep(3000);

            string jsonJaneHopper = roomHub.Rejoin(roomId, janeHopperId);
            try
            {
                JsonSerializer.Deserialize<object>(jsonJaneHopper);
            }
            catch (JsonException)
            {
                Assert.Fail("The return value for user Jane Hopper should be valid JSON");
            }

            actualActiveUserCount = room.GetActiveUsers().Count;
            Assert.AreEqual(3, actualActiveUserCount, "The room should have 3 active users");
        }

        [Test]
        public void UserRejoinsRoomWithNoUsersLeft()
        {
            var room = Hubs.RoomHub.Rooms[0];
            string roomId = room.Id;

            UpdateConnectionId();
            roomHub.JoinRoom(roomId, "Jim Hopper");

            var jimHopper = room.GetAllUsers().Find(x => x.Name == "Jim Hopper");
            string jimHopperId = jimHopper.Id;
            roomHub.LeaveRoom(roomId, jimHopperId);

            int actualTotalUserCount = room.GetAllUsers().Count;
            Assert.AreEqual(1, actualTotalUserCount, "The room should have 1 total users");
            int actualActiveUserCount = room.GetActiveUsers().Count;
            Assert.AreEqual(0, actualActiveUserCount, "The room should have 0 active users");

            Thread.Sleep(3000);

            string jsonJimHopper = roomHub.Rejoin(roomId, jimHopperId);
            try
            {
                JsonSerializer.Deserialize<object>(jsonJimHopper);
            }
            catch (JsonException)
            {
                Assert.Fail("The return value for user Jim Hopper should be valid JSON");
            }

            actualActiveUserCount = room.GetActiveUsers().Count;
            Assert.AreEqual(1, actualActiveUserCount, "The room should have 1 active user");
        }

        [Test]
        public void UserTriesRejoiningRoomWithUsersLeftAfterRejoinWindow()
        {
            var room = Hubs.RoomHub.Rooms[0];
            string roomId = room.Id;

            UpdateConnectionId();
            roomHub.JoinRoom(roomId, "Jim Hopper");
            UpdateConnectionId();
            roomHub.JoinRoom(roomId, "Jane Hopper");
            UpdateConnectionId();
            roomHub.JoinRoom(roomId, "Joyce Byers");

            var janeHopper = room.GetAllUsers().Find(x => x.Name == "Jane Hopper");
            string janeHopperId = janeHopper.Id;
            roomHub.LeaveRoom(roomId, janeHopperId);

            int actualTotalUserCount = room.GetAllUsers().Count;
            Assert.AreEqual(3, actualTotalUserCount, "The room should have 3 total users");
            int actualActiveUserCount = room.GetActiveUsers().Count;
            Assert.AreEqual(2, actualActiveUserCount, "The room should have 2 active users");

            Thread.Sleep(31000);

            string jsonJaneHopper = roomHub.Rejoin(roomId, janeHopperId);
            Assert.AreEqual("USER_DOES_NOT_EXIST", jsonJaneHopper, "The return value for Jane Hopper should be USER_DOES_NOT_EXIST");

            actualActiveUserCount = room.GetActiveUsers().Count;
            Assert.AreEqual(2, actualActiveUserCount, "The room should have 2 active users");
        }

        [Test]
        public void UserTriesRejoiningRoomWithNoUsersLeftAfterRejoinWindow()
        {
            var room = Hubs.RoomHub.Rooms[0];
            string roomId = room.Id;

            UpdateConnectionId();
            roomHub.JoinRoom(roomId, "Jim Hopper");

            var jimHopper = room.GetAllUsers().Find(x => x.Name == "Jim Hopper");
            string jimHopperId = jimHopper.Id;
            roomHub.LeaveRoom(roomId, jimHopperId);

            int actualTotalUserCount = room.GetAllUsers().Count;
            Assert.AreEqual(1, actualTotalUserCount, "The room should have 1 total users");
            int actualActiveUserCount = room.GetActiveUsers().Count;
            Assert.AreEqual(0, actualActiveUserCount, "The room should have 0 active users");

            Thread.Sleep(31000);

            string jsonJimHopper = roomHub.Rejoin(roomId, jimHopperId);
            Assert.AreEqual("ROOM_DOES_NOT_EXIST", jsonJimHopper, "The return value for Jim Hopper should be ROOM_DOES_NOT_EXIST");

            int roomCount = Hubs.RoomHub.Rooms.Count;
            Assert.AreEqual(0, roomCount, "The hub should contain 0 rooms");
        }

        [TearDown]
        public void TearDown()
        {
            Hubs.RoomHub.Rooms.RemoveRange(0, Hubs.RoomHub.Rooms.Count);
        }
    }
}
