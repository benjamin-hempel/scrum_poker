using System;
using TechTalk.SpecFlow;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace scrum_poker.Tests.Bindings.Room
{
    [Binding]
    public class CreateRoomSteps
    {
        private Models.Room room;

        [When(@"I create a new room with the card deck ""(.*)""")]
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
    }
}
