using System;
using Microsoft.AspNetCore.SignalR;
using NUnit.Framework;
using Moq;
using System.Threading;

namespace scrum_poker.Tests.NUnit.RoomHubTests
{
    class LeaveRoom
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
        public void UserLeavesRoomWithUsersLeft()
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

            actualTotalUserCount = room.GetAllUsers().Count;
            Assert.AreEqual(2, actualTotalUserCount, "The room should have 2 total users");
            actualActiveUserCount = room.GetActiveUsers().Count;
            Assert.AreEqual(2, actualActiveUserCount, "The room should have 2 active users");
        }

        [Test]
        public void UserLeavesRoomWithNoUsersLeft()
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
