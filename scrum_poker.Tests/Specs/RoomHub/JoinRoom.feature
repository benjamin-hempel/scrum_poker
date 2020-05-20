Feature: JoinRoom
	In order to enable users to play together
	as a developer
	I want to enable users to join a room.

Scenario: Single user joins single room
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	When I let a user with username "Jim Hopper" join room "1"
	Then room "1" should contain "1" users
	And the return value for user "Jim Hopper" should be valid JSON

Scenario: Multiple users join single room
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	When I let a user with username "Jim Hopper" join room "1"
	And I let a user with username "Jane Hopper" join room "1"
	And I let a user with username "Joyce Byers" join room "1"
	Then room "1" should contain "3" users
	And the return value for user "Jim Hopper" should be valid JSON
	And the return value for user "Jane Hopper" should be valid JSON
	And the return value for user "Joyce Byers" should be valid JSON

Scenario: Multiple users join multiple rooms
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	And I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	When I let a user with username "Jim Hopper" join room "1"
	And I let a user with username "Jane Hopper" join room "1"
	And I let a user with username "Joyce Byers" join room "2"
	Then room "1" should contain "2" users
	And room "2" should contain "1" users
	And the return value for user "Jim Hopper" should be valid JSON
	And the return value for user "Jane Hopper" should be valid JSON
	And the return value for user "Joyce Byers" should be valid JSON