using System;
using NUnit.Framework;
using Microsoft.AspNetCore.SignalR;
using Moq;

namespace scrum_poker.Tests.NUnit.RoomHubTests
{
    class RevealCards
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
        public void RevealAllCards()
        {
            string roomId = roomHub.CreateRoom("1,2,3,4,5,6", false);
            Models.Room room = Hubs.RoomHub.Rooms.Find(x => x.Id == roomId);

            roomHub.RevealCards(roomId);
            Assert.IsTrue(room.CardsRevealed, $"The cards in room {room.Id} should be revealed");
        }

        [TearDown]
        public void TearDown()
        {
            Hubs.RoomHub.Rooms.RemoveRange(0, Hubs.RoomHub.Rooms.Count);
        }
    }
}
