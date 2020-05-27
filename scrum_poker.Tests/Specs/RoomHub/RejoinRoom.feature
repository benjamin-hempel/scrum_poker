Feature: Rejoin Room

Scenario: User rejoins room with users left in the room
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	And I let a user with username "Jim Hopper" join room "1"
	And I let a user with username "Jane Hopper" join room "1"
	And I let a user with username "Joyce Byers" join room "1"
	And user "Jane Hopper" leaves room "1"
	And room "1" contains "2" active users
	And room "1" contains "3" total users
	When I wait "3" seconds
	And user "Jane Hopper" rejoins room "1"
	Then room "1" should contain "3" active users
	And the return value for user "Jane Hopper" should be valid JSON

Scenario: User rejoins room with no users left in the room
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	And I let a user with username "Jim Hopper" join room "1"
	And user "Jim Hopper" leaves room "1"
	And room "1" contains "0" active users
	And room "1" contains "1" total users
	When I wait "3" seconds
	And user "Jim Hopper" rejoins room "1"
	Then room "1" should contain "1" active users
	And the return value for user "Jim Hopper" should be valid JSON

Scenario: User tries rejoining room with users left after rejoin time window
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	And I let a user with username "Jim Hopper" join room "1"
	And I let a user with username "Jane Hopper" join room "1"
	And I let a user with username "Joyce Byers" join room "1"
	And user "Jane Hopper" leaves room "1"
	And room "1" contains "2" active users
	And room "1" contains "3" total users
	When I wait "31" seconds
	And user "Jane Hopper" rejoins room "1"
	Then room "1" should contain "2" active users
	And the return value for user "Jane Hopper" should be "USER_DOES_NOT_EXIST"

Scenario: User tries rejoining room with no users left after rejoin time window
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	And I let a user with username "Jim Hopper" join room "1"
	And user "Jim Hopper" leaves room "1"
	And room "1" contains "0" active users
	And room "1" contains "1" total users
	When I wait "31" seconds
	And user "Jim Hopper" rejoins room "1"
	Then the hub should contain "0" rooms
	And the return value for user "Jim Hopper" should be "ROOM_DOES_NOT_EXIST"