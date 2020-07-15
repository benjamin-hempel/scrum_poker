using NUnit.Framework;

namespace scrum_poker.Tests.NUnit.RoomHubTests
{
    class RejoinRoom
    {
        [SetUp]
        public void SetUp()
        {

        }

        [Test]
        public void UserRejoinsRoomWithUsersLeft()
        {
            Assert.Pass();
        }

        [Test]
        public void UserRejoinsRoomWithNoUsersLeft()
        {
            Assert.Pass();
        }

        [Test]
        public void UserTriesRejoiningRoomWithUsersLeftAfterRejoinWindow()
        {
            Assert.Pass();
        }

        [Test]
        public void UserTriesRejoiningRoomWithNoUsersLeftAfterRejoinWindow()
        {
            Assert.Pass();
        }
    }
}
