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
            UpdateMockConnectionId();
            string roomId = GetRoomId(roomIndex);

            string result = RoomHub.JoinRoom(roomId, username);
            JoinReturnValues.Add(username, result);
        }

        [Then(@"room ""(.*)"" should contain ""(.*)"" active users")]
        [Given(@"room ""(.*)"" contains ""(.*)"" active users")]
        public void ThenRoomShouldContainActiveUsers(int roomIndex, int expectedUserCount)
        {
            List<Models.User> users = GetActiveUsers(roomIndex);

            Assert.AreEqual(expectedUserCount, users.Count, $"Room {roomIndex} should contain {expectedUserCount} active users.");
        }

        [Then(@"room ""(.*)"" should contain ""(.*)"" total users")]
        [Given(@"room ""(.*)"" contains ""(.*)"" total users")]
        public void ThenRoomShouldContainTotalUsers(int roomIndex, int expectedUserCount)
        {
            List<Models.User> users = GetAllUsers(roomIndex);

            Assert.AreEqual(expectedUserCount, users.Count, $"Room {roomIndex} should contain {expectedUserCount} total users.");
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

        [When(@"user ""(.*)"" leaves room ""(.*)""")]
        [Given(@"user ""(.*)"" leaves room ""(.*)""")]
        public void WhenUserLeavesRoom(string username, int roomIndex)
        {
            UpdateMockConnectionId();
            string roomId = GetRoomId(roomIndex);
            string userId = GetUserId(username, roomId);

            RoomHub.LeaveRoom(roomId, userId);
        }

        [When(@"user ""(.*)"" rejoins room ""(.*)""")]
        public void WhenUserRejoinsRoom(string username, int roomIndex)
        {
            UpdateMockConnectionId();
            string roomId = GetRoomId(roomIndex);
            string userId = GetUserId(username, roomId);

            string result = RoomHub.Rejoin(roomId, userId);

            JoinReturnValues.Remove(username);
            JoinReturnValues.Add(username, result);
        }

        [When(@"user ""(.*)"" in room ""(.*)"" selects card ""(.*)""")]
        [Given(@"user ""(.*)"" in room ""(.*)"" selects card ""(.*)""")]
        public void WhenUserInRoomSelectsCard(string username, int roomIndex, int selectedCard)
        {
            UpdateMockConnectionId();
            string roomId = GetRoomId(roomIndex);
            string userId = GetUserId(username, roomId);

            RoomHub.SelectCard(roomId, userId, selectedCard);
        }

        [Then(@"user ""(.*)"" in room ""(.*)"" should have card ""(.*)"" selected")]
        [Given(@"user ""(.*)"" in room ""(.*)"" has card ""(.*)"" selected")]
        public void ThenUserInRoomShouldHaveCardSelected(string username, int roomIndex, int expectedSelectedCard)
        {
            Models.User user = GetUser(roomIndex, username);

            Assert.AreEqual(expectedSelectedCard, user.SelectedCard, $"The user should have card {expectedSelectedCard} selected.");
        }

        [Then(@"the played cards counter in room ""(.*)"" should be ""(.*)""")]
        [Given(@"the played cards counter in room ""(.*)"" is ""(.*)""")]
        public void ThenThePlayedCardsCounterInRoomShouldBe(int roomIndex, int expectedCardsCounter)
        {
            int actualCardsCounter = -1;

            try
            {
                Models.Room room = GetRoom(roomIndex);
                actualCardsCounter = room.PlayedCards;
            } 
            catch (NullReferenceException)
            {
                Assert.IsTrue(false, $"Room {roomIndex} does not exist.");
            }

            Assert.AreEqual(expectedCardsCounter, actualCardsCounter, $"Room {roomIndex} should have {expectedCardsCounter} played cards.");
        }

        [When(@"user ""(.*)"" in room ""(.*)"" deselects their card")]
        public void WhenUserInRoomDeselectsTheirCard(string username, int roomIndex)
        {
            UpdateMockConnectionId();
            string roomId = GetRoomId(roomIndex);
            string userId = GetUserId(username, roomId);

            RoomHub.SelectCard(roomId, userId, -1);
        }

        [When(@"the cards in room ""(.*)"" are revealed")]
        public void WhenTheCardsInRoomAreRevealed(int roomIndex)
        {
            string roomId = GetRoomId(roomIndex);

            RoomHub.RevealCards(roomId);
        }

        [Then(@"the cards in room ""(.*)"" should be revealed")]
        public void ThenTheCardsInRoomShouldBeRevealed(int roomIndex)
        {
            Models.Room room = GetRoom(roomIndex);

            Assert.IsTrue(room.CardsRevealed, $"The cards in room {roomIndex} should be revealed.");
        }

        [When(@"the cards in room ""(.*)"" are reset")]
        public void WhenTheCardsInRoomAreReset(int roomIndex)
        {
            string roomId = GetRoomId(roomIndex);

            RoomHub.ResetCards(roomId);
        }

        [Then(@"the cards in room ""(.*)"" should not be revealed")]
        public void ThenTheCardsInRoomShouldNotBeRevealed(int roomIndex)
        {
            Models.Room room = GetRoom(roomIndex);

            Assert.IsFalse(room.CardsRevealed, $"The cards in room {roomIndex} should not be revealed.");
        }

        #region HelperMethods

        public Models.Room GetRoom(int roomIndex)
        {
            Models.Room room;

            try
            {
                room = Hubs.RoomHub.Rooms[roomIndex - 1];
            }
            catch(ArgumentOutOfRangeException)
            {
                room = null;
            }

            return room;
        }

        public List<Models.User> GetActiveUsers(int roomIndex)
        {
            List<Models.User> users = null;

            try
            {
                Models.Room room = GetRoom(roomIndex);
                users = room.GetActiveUsers();
            }
            catch (NullReferenceException)
            {
                Assert.IsTrue(false, $"Room {roomIndex} does not exist.");
            }

            return users;
        }

        public List<Models.User> GetAllUsers(int roomIndex)
        {
            List<Models.User> users = null;

            try
            {
                Models.Room room = GetRoom(roomIndex);
                users = room.GetAllUsers();
            }
            catch(NullReferenceException)
            {
                Assert.IsTrue(false, $"Room {roomIndex} does not exist.");
            }

            return users;
        }

        public Models.User GetUser(int roomIndex, string username)
        {
            Models.User user = null;
            
            try
            {
                Models.Room room = GetRoom(roomIndex);
                user = room.GetAllUsers().Find(x => x.Name == username);
            }
            catch (NullReferenceException)
            {
                Assert.IsTrue(false, $"Room {roomIndex} does not exist.");
            }

            return user;
        }

        public string GetRoomId(int roomIndex)
        {
            string roomId;

            try
            {
                Models.Room room = GetRoom(roomIndex);
                roomId = room.Id;
            }
            catch (NullReferenceException)
            {
                // Use "fake" room ID if room does not exist
                roomId = new Guid().ToString();
            }

            return roomId;
        }

        public string GetUserId(string username, string roomId)
        {
            string userId;

            try
            {
                Models.Room room = Hubs.RoomHub.Rooms.Find(x => x.Id == roomId);
                Models.User user = room.GetAllUsers().Find(x => x.Name == username);
                userId = user.Id;
            } 
            catch(NullReferenceException)
            {
                // Use "fake" user ID if user does not exist in room
                userId = new Guid().ToString();
            }

            return userId;
        }

        public void UpdateMockConnectionId()
        {
            mockHubCallerContext.Setup(c => c.ConnectionId).Returns(Guid.NewGuid().ToString());
            RoomHub.Context = mockHubCallerContext.Object;
        }

        #endregion

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
