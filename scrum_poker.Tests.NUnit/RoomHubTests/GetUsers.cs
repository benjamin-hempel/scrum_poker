using NUnit.Framework;

namespace scrum_poker.Tests.NUnit.RoomHubTests
{
    class GetUsers
    {
        [SetUp]
        public void SetUp()
        {

        }

        [Test]
        public void GetAllUsers()
        {
            Assert.Pass();
        }

        [Test]
        public void GetUsersFromNonExistingRoom()
        {
            Assert.Pass();
        }

        [Test]
        public void GetUsersFromRoomWithMissingInActionUsers()
        {
            Assert.Pass();
        }
    }
}
