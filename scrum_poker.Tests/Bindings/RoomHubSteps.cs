using System;
using System.Collections.Generic;
using System.Text;
using TechTalk.SpecFlow;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Text.Json;
using Moq;
using Microsoft.AspNetCore.SignalR;

namespace scrum_poker.Tests.Bindings
{
    [Binding]
    class RoomHubSteps
    {
        private Hubs.RoomHub RoomHub = new Hubs.RoomHub();

        private Dictionary<string, string> JoinReturnValues = new Dictionary<string, string>();

        private Mock<HubCallerContext> mockHubCallerContext;
        private Mock<IHubCallerClients> mockCallerClients;

        [When(@"I add a new room to the hub with the card deck ""(.*)""")]
        [Given(@"I have added a new room to the hub with the card deck ""(.*)""")]
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

        [When(@"I let a user with username ""(.*)"" join room ""(.*)""")]
        [Given(@"I let a user with username ""(.*)"" join room ""(.*)""")]
        public void WhenILetAUserWithUsernameJoinRoom(string username, int roomIndex)
        {
            string roomId;
            UpdateMockConnectionId();

            try
            {
                Models.Room room = Hubs.RoomHub.Rooms[roomIndex - 1];
                roomId = room.Id;
            }
            catch(ArgumentOutOfRangeException e)
            {
                // Use "fake" room ID if room does not exist
                roomId = new Guid().ToString();
            }

            string result = RoomHub.JoinRoom(roomId, username);
            JoinReturnValues.Add(username, result);
        }

        [Then(@"room ""(.*)"" should contain ""(.*)"" active users")]
        public void ThenRoomShouldContainActiveUsers(int roomIndex, int expectedUserCount)
        {
            Models.Room room = Hubs.RoomHub.Rooms[roomIndex - 1];
            List<Models.User> users = room.GetActiveUsers();

            Assert.AreEqual(expectedUserCount, users.Count, $"Room {roomIndex} should contain {expectedUserCount} users.");
        }

        [Then(@"the return value for user ""(.*)"" should be valid JSON")]
        public void ThenTheReturnValueForUserInRoomShouldBeValidJSON(string username)
        {
            string json = JoinReturnValues[username];

            try
            {
                JsonSerializer.Deserialize<object>(json);
            }
            catch(JsonException)
            {
                Assert.IsTrue(false, $"The return value {json} is not valid JSON.");
            }
        }

        [Then(@"the return value for user ""(.*)"" should be ""(.*)""")]
        public void ThenTheReturnValueForUserShouldBe(string username, string expectedReturnValue)
        {
            string actualReturnValue = JoinReturnValues[username];

            Assert.AreEqual(expectedReturnValue, actualReturnValue, $"The return value for user {username} should be {expectedReturnValue}.");
        }


        public void UpdateMockConnectionId()
        {
            mockHubCallerContext.Setup(c => c.ConnectionId).Returns(Guid.NewGuid().ToString());
            RoomHub.Context = mockHubCallerContext.Object;
        }

        #region BeforeAfterMethods

        [BeforeScenario]
        public void CreateMocks()
        {
            mockHubCallerContext = new Mock<HubCallerContext>();
            mockCallerClients = new Mock<IHubCallerClients>();

            RoomHub.Clients = mockCallerClients.Object;
        }

        // RoomHub.Rooms is static and thus shared between all instances, so it needs to be cleared after every scenario
        [AfterScenario]
        public void ClearRoomHub()
        {
            Hubs.RoomHub.Rooms.RemoveRange(0, Hubs.RoomHub.Rooms.Count);
        }

        #endregion
    }
}
