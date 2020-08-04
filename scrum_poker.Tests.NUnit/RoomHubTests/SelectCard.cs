using System;
using System.Collections.Generic;
using NUnit.Framework;
using Microsoft.AspNetCore.SignalR;
using Moq;

namespace scrum_poker.Tests.NUnit.RoomHubTests
{
    class SelectCard
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
        public void SingleUserSelectsSingleCard()
        {
            Models.Room room = Hubs.RoomHub.Rooms[0];
            UpdateConnectionId();
            roomHub.JoinRoom(room.Id, "Jim Hopper");

            Models.User jimHopper = room.GetAllUsers().Find(x => x.Name == "Jim Hopper");
            roomHub.SelectCard(room.Id, jimHopper.Id, 4);
            Assert.AreEqual(4, jimHopper.SelectedCard, "Jim Hopper should have card 4 selected");
            Assert.AreEqual(1, room.PlayedCards, $"Room {room.Id} should have 1 played card");
        }

        [Test]
        public void SingleUserSelectsAndDeselectsCard()
        {
            Models.Room room = Hubs.RoomHub.Rooms[0];
            UpdateConnectionId();
            roomHub.JoinRoom(room.Id, "Jim Hopper");

            Models.User jimHopper = room.GetAllUsers().Find(x => x.Name == "Jim Hopper");
            roomHub.SelectCard(room.Id, jimHopper.Id, 4);
            Assert.AreEqual(4, jimHopper.SelectedCard, "Jim Hopper should have card 4 selected");
            Assert.AreEqual(1, room.PlayedCards, $"Room {room.Id} should have 1 played card");

            roomHub.SelectCard(room.Id, jimHopper.Id, -1);
            Assert.AreEqual(-1, jimHopper.SelectedCard, "Jim Hopper should have card -1 selected");
            Assert.AreEqual(0, room.PlayedCards, $"Room {room.Id} should have 0 played cards");
        }

        [Test]
        public void MultipleUsersSelectAndDeselectMultipleCards()
        {
            Models.Room room = Hubs.RoomHub.Rooms[0];
            UpdateConnectionId();
            roomHub.JoinRoom(room.Id, "Jim Hopper");
            UpdateConnectionId();
            roomHub.JoinRoom(room.Id, "Jane Hopper");
            UpdateConnectionId();
            roomHub.JoinRoom(room.Id, "Joyce Byers");
            UpdateConnectionId();
            roomHub.JoinRoom(room.Id, "Jonathan Byers");

            Models.User jimHopper = room.GetAllUsers().Find(x => x.Name == "Jim Hopper");
            Models.User janeHopper = room.GetAllUsers().Find(x => x.Name == "Jane Hopper");
            Models.User joyceByers = room.GetAllUsers().Find(x => x.Name == "Joyce Byers");
            Models.User jonathanByers = room.GetAllUsers().Find(x => x.Name == "Jonathan Byers");

            roomHub.SelectCard(room.Id, jimHopper.Id, 4);
            roomHub.SelectCard(room.Id, janeHopper.Id, 3);
            roomHub.SelectCard(room.Id, jonathanByers.Id, 5);
            roomHub.SelectCard(room.Id, joyceByers.Id, 2);
            roomHub.SelectCard(room.Id, janeHopper.Id, 5);
            roomHub.SelectCard(room.Id, jimHopper.Id, -1);

            Assert.AreEqual(-1, jimHopper.SelectedCard, "Jim Hopper should have card -1 selected");
            Assert.AreEqual(5, janeHopper.SelectedCard, "Jane Hopper should have card 5 selected");
            Assert.AreEqual(2, joyceByers.SelectedCard, "Joyce Byers should have card 2 selected");
            Assert.AreEqual(5, jonathanByers.SelectedCard, "Jonathan Byers should have card 5 selected");

            Assert.AreEqual(3, room.PlayedCards, $"Room {room.Id} should have 3 played cards");
        }

        [TearDown]
        public void TearDown()
        {
            Hubs.RoomHub.Rooms.RemoveRange(0, Hubs.RoomHub.Rooms.Count);
        }
    }
}
