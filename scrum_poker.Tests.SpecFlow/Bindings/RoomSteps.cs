using System;
using TechTalk.SpecFlow;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace scrum_poker.Tests.SpecFlow.Bindings
{
    [Binding]
    public class RoomSteps
    {
        private Models.Room Room;

        [When(@"I create a new room with the card deck ""(.*)""")]
        [Given(@"I have created a room with the card deck ""(.*)""")]
        public void WhenICreateANewRoomWithTheCardDeck(string cardDeck)
        {
            Room = new Models.Room(cardDeck);
        }

        [Given(@"I have created a room with the card deck ""(.*)"" in which all users should be administrator")]
        public void GivenIHaveCreatedARoomWithTheCardDeckInWhichAllUsersShouldBeAdministrator(string cardDeck)
        {
            Room = new Models.Room(cardDeck, true);
        }

        [Then(@"the ""(.*)"" attribute should be a GUID")]
        public void ThenTheAttributeShouldBeAGUID(string attribute)
        {
            var property = Room.GetType().GetProperty(attribute);
            Assert.IsNotNull(property, $"The attribute {attribute} does not exist.");

            var toCheck = property.GetValue(Room).ToString();
            bool isGuid = Guid.TryParse(toCheck, out _);
            Assert.IsTrue(isGuid, $"The attribute {attribute} should be a GUID.");
        }
        
        [Then(@"the ""(.*)"" attribute should be ""(.*)""")]
        public void ThenTheAttributeShouldBe(string attribute, string value)
        {
            var property = Room.GetType().GetProperty(attribute);
            Assert.IsNotNull(property, $"The attribute {attribute} does not exist.");

            var toCheck = property.GetValue(Room).ToString();
            Assert.AreEqual(value, toCheck, $"{attribute} should be {value}.");
        }

        [When(@"I add a new user with username ""(.*)"" and connection ID ""(.*)"" to the room")]
        [Given(@"I have added a new user with username ""(.*)"" and connection ID ""(.*)"" to the room")]
        public void WhenIAddANewUserWithUsernameAndConnectionIDToTheRoom(string username, string connectionId)
        {
            Room.AddUser(username, connectionId);
        }

        [Then(@"the room should contain ""(.*)"" users")]
        public void ThenTheRoomShouldContainUsers(int expectedUsers)
        {
            int actualUsers = Room.GetAllUsers().Count;
            Assert.AreEqual(expectedUsers, actualUsers, $"The room should contain {expectedUsers} users.");
        }

        [Then(@"the room should contain ""(.*)"" connections")]
        public void ThenTheRoomShouldContainConnections(int expectedConnections)
        {
            int actualConnections = Room.Connections.Count;
            Assert.AreEqual(expectedConnections, actualConnections, $"The room should contain {expectedConnections} connections.");
        }

        [Then(@"the first user in the room should be administrator")]
        public void ThenTheFirstUserInTheRoomShouldBeAdministrator()
        {
            Models.User firstUser = Room.GetAllUsers()[0];
            Assert.IsTrue(firstUser.IsAdmin, "The first user in the room should be administrator.");
        }

        [Then(@"all users in the room should be administrator")]
        public void ThenAllUsersInTheRoomShouldBeAdministrator()
        {
            List<Models.User> users = Room.GetAllUsers();
            foreach(var user in users)
            {
                Assert.IsTrue(user.IsAdmin, "All users in the room should be administrator.");
            }
        }

        [When(@"I remove the user with username ""(.*)"" from the room")]
        public void WhenIRemoveTheUserWithConnectionIDFromTheRoom(string username)
        {
            List<Models.User> users = Room.GetAllUsers();
            Models.User user = users.Find(x => x.Name == username);
            Room.RemoveUser(user.Id);
        }

    }
}
