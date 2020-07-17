using System;
using System.Text.Json;
using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;
using NUnit.Framework;
using Moq;
using System.Runtime.CompilerServices;

namespace scrum_poker.Tests.NUnit.RoomHubTests
{
    class ResetCards
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
        public void ResetAllCards()
        {
            roomHub.CreateRoom("1,2,3,4,5,6", false);
            Models.Room room = Hubs.RoomHub.Rooms[0];

            UpdateConnectionId();
            roomHub.JoinRoom(room.Id, "Jim Hopper");
            UpdateConnectionId();
            roomHub.JoinRoom(room.Id, "Jane Hopper");
            UpdateConnectionId();
            roomHub.JoinRoom(room.Id, "Joyce Byers");

            
            List<Models.User> users = room.GetAllUsers();

            Models.User jimHopper = users.Find(x => x.Name == "Jim Hopper");
            Models.User janeHopper = users.Find(x => x.Name == "Jane Hopper");
            Models.User joyceByers = users.Find(x => x.Name == "Joyce Byers");

            roomHub.SelectCard(room.Id, jimHopper.Id, 4);
            Assert.AreEqual(4, jimHopper.SelectedCard, $"Jim Hopper should have card 4 selected");
            roomHub.SelectCard(room.Id, janeHopper.Id, 6);
            Assert.AreEqual(6, janeHopper.SelectedCard, $"Jane Hopper should have card 6 selected");
            roomHub.SelectCard(room.Id, joyceByers.Id, 1);
            Assert.AreEqual(1, joyceByers.SelectedCard, $"Joyce Byers should have card 1 selected");

            roomHub.RevealCards(room.Id);
            Assert.IsTrue(room.CardsRevealed, $"The cards in room {room.Id} should be revealed");
            roomHub.ResetCards(room.Id);
            Assert.IsFalse(room.CardsRevealed, $"The cards in room {room.Id} should not be revealed");
            
            foreach(var user in users)
                Assert.AreEqual(-1, user.SelectedCard, $"User {user.Id} should have card -1 selected");
        }

        [TearDown]
        public void TearDown()
        {
            Hubs.RoomHub.Rooms.RemoveRange(0, Hubs.RoomHub.Rooms.Count);
        }
    }
}
