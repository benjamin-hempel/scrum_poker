using System;
using NUnit.Framework;

namespace scrum_poker.Tests.NUnit.RoomTests
{
    class CreateRoom
    {
        [SetUp]
        public void SetUp()
        {

        }

        [Test]
        public void CreateNewRoom()
        {
            var room = new Models.Room("1,2,3,4,5,6");
            string id = room.Id;

            Assert.IsTrue(Guid.TryParse(id, out _), "The room ID should be a GUID");
        }
    }
}
