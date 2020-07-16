using System;
using System.Collections.Generic;
using System.Text.Json;
using NUnit.Framework;
using Moq;
using Microsoft.AspNetCore.SignalR;

namespace scrum_poker.Tests.NUnit.RoomHubTests
{
    class GetUsers
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
        public void GetAllUsers()
        {
            var room = Hubs.RoomHub.Rooms[0];
            string roomId = room.Id;

            UpdateConnectionId();
            roomHub.JoinRoom(roomId, "Jim Hopper");
            UpdateConnectionId();
            roomHub.JoinRoom(roomId, "Jane Hopper");
            UpdateConnectionId();
            roomHub.JoinRoom(roomId, "Joyce Byers");

            string jsonRoomUsers = roomHub.GetUsers(roomId);
            var roomUsers = JsonSerializer.Deserialize<List<object>>(jsonRoomUsers);
            int actualUserCount = roomUsers.Count;
            Assert.AreEqual(3, actualUserCount, $"The hub should return 3 users for room {roomId}");
        }

        [Test]
        public void GetUsersFromNonExistingRoom()
        {
            string jsonRoomUsers = roomHub.GetUsers("OldMacdonaldHadAFarm");
            Assert.AreEqual("ROOM_DOES_NOT_EXIST", jsonRoomUsers, "The hub should return ROOM_DOES_NOT_EXIST when getting users");
        }

        [Test]
        public void GetUsersFromRoomWithMissingInActionUsers()
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

            string jsonRoomUsers = roomHub.GetUsers(roomId);
            var roomUsers = JsonSerializer.Deserialize<List<object>>(jsonRoomUsers);
            int actualUserCount = roomUsers.Count;
            Assert.AreEqual(2, actualUserCount, $"The hub should return 2 users for room {roomId}");
        }

        [TearDown]
        public void TearDown()
        {
            Hubs.RoomHub.Rooms.RemoveRange(0, Hubs.RoomHub.Rooms.Count);
        }
    }
}
