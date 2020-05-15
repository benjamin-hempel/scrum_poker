using System;
using TechTalk.SpecFlow;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace scrum_poker.Tests.Bindings
{
    [Binding]
    public class RoomSteps
    {
        private Models.Room room;

        [When(@"I create a new room with the card deck ""(.*)""")]
        [Given(@"I have created a room with the card deck ""(.*)""")]
        public void WhenICreateANewRoomWithTheCardDeck(string cardDeck)
        {
            room = new Models.Room(cardDeck);
        }
        
        [Then(@"the ""(.*)"" attribute should be a GUID")]
        public void ThenTheAttributeShouldBeAGUID(string attribute)
        {
            var property = room.GetType().GetProperty(attribute);
            Assert.IsNotNull(property, $"The attribute {attribute} does not exist.");

            var toCheck = property.GetValue(room).ToString();
            bool isGuid = Guid.TryParse(toCheck, out _);
            Assert.IsTrue(isGuid, $"The attribute {attribute} should be a GUID.");
        }
        
        [Then(@"the ""(.*)"" attribute should be ""(.*)""")]
        public void ThenTheAttributeShouldBe(string attribute, string value)
        {
            var property = room.GetType().GetProperty(attribute);
            Assert.IsNotNull(property, $"The attribute {attribute} does not exist.");

            var toCheck = property.GetValue(room).ToString();
            Assert.AreEqual(value, toCheck, $"{attribute} should be {value}.");
        }

        [When(@"I add a new user with username ""(.*)"" and connection ID ""(.*)"" to the room")]
        public void WhenIAddANewUserWithUsernameAndConnectionIDToTheRoom(string username, string connectionId)
        {
            room.AddUser(username, connectionId);
        }

        [Then(@"the room should contain ""(.*)"" users")]
        public void ThenTheRoomShouldContainUsers(int expectedUsers)
        {
            int actualUsers = room.GetUsers().Count;
            Assert.AreEqual(expectedUsers, actualUsers, $"The room should contain {expectedUsers} users.");
        }

        [Then(@"the room should contain ""(.*)"" connections")]
        public void ThenTheRoomShouldContainConnections(int expectedConnections)
        {
            int actualConnections = room.Connections.Count;
            Assert.AreEqual(expectedConnections, actualConnections, $"The room should contain {expectedConnections} connections.");
        }

        [Then(@"the first user in the room should be administrator")]
        public void ThenTheFirstUserInTheRoomShouldBeAdministrator()
        {
            Models.User firstUser = room.GetUsers()[0];
            Assert.IsTrue(firstUser.IsAdmin, "The first user in the room should be administrator.");
        }
    }
}
