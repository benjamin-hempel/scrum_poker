using System;
using System.Collections.Generic;
using System.Text;
using TechTalk.SpecFlow;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace scrum_poker.Tests.Bindings
{
    [Binding]
    class RoomHubSteps
    {
        private Hubs.RoomHub RoomHub = new Hubs.RoomHub();

        [When(@"I add a new room to the hub with the card deck ""(.*)""")]
        public void WhenIAddANewRoomToTheHubWithTheCardDeck(String cardDeck)
        {
            string roomId = RoomHub.CreateRoom(cardDeck, false);

            Assert.IsNotNull(roomId, "CreateRoom() should return the created room's ID.");
            bool isGuid = Guid.TryParse(roomId, out _);
            Assert.IsTrue(isGuid, $"The room ID returned by CreateRoom() should be a GUID.");
        }

        [Then(@"the hub should contain ""(.*)"" rooms")]
        public void ThenTheHubShouldContainRooms(int expectedRoomCount)
        {
            int actualRoomCount = Hubs.RoomHub.Rooms.Count;
            Assert.AreEqual(expectedRoomCount, actualRoomCount, $"The hub should contain {expectedRoomCount} rooms");
        }

        // RoomHub.Rooms is static and thus shared between all instances, so it needs to be cleared after every scenario
        [AfterScenario]
        public void ClearRoomHub()
        {
            Hubs.RoomHub.Rooms.RemoveRange(0, Hubs.RoomHub.Rooms.Count);
        }
    }
}
