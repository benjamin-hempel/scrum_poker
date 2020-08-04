using NUnit.Framework;

namespace scrum_poker.Tests.NUnit.RoomHubTests
{
    class CreateRoom
    {
        private Hubs.RoomHub roomHub = new Hubs.RoomHub();

        [SetUp]
        public void SetUp()
        {

        }

        [Test]
        public void AddSingleRoom()
        {
            roomHub.CreateRoom("1,2,3,4,5,6", false);

            int actualRoomCount = Hubs.RoomHub.Rooms.Count;
            Assert.AreEqual(1, actualRoomCount, "The hub should contain 1 room");
        }

        [Test]
        public void AddMultipleRooms()
        {
            roomHub.CreateRoom("1,2,3,4,5,6", false);
            roomHub.CreateRoom("1,2,3,4,5,6", false);
            roomHub.CreateRoom("1,2,3,4,5,6", false);

            int actualRoomCount = Hubs.RoomHub.Rooms.Count;
            Assert.AreEqual(3, actualRoomCount, "The hub should contain 3 rooms");
        }

        [TearDown]
        public void TearDown()
        {
            Hubs.RoomHub.Rooms.RemoveRange(0, Hubs.RoomHub.Rooms.Count);
        }
    }
}
