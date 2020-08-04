using NUnit.Framework;

namespace scrum_poker.Tests.NUnit.RoomTests
{
    class RemoveUserFromRoom
    {
        [SetUp]
        public void SetUp()
        {

        }

        [Test]
        public void RemoveSingleUserFromRoom()
        {
            var room = new Models.Room("1,2,3,4,5,6");
            var jimHopper = room.AddUser("Jim Hopper", "1");
            room.AddUser("Jane Hopper", "2");
            room.RemoveUser(jimHopper.Id);

            int actualUserCount = room.GetAllUsers().Count;
            Assert.AreEqual(1, actualUserCount, "The room should contain 1 user");
        }
    }
}
