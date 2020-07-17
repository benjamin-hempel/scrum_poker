Feature: Get Users

Background:
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"

Scenario: Get users
	When I let a user with username "Jim Hopper" join room "1"
	And I let a user with username "Jane Hopper" join room "1"
	And I let a user with username "Joyce Byers" join room "1"
	Then "3" users should be returned by the hub for room "1"

Scenario: Get users from non-existing room
	Then "ROOM_DOES_NOT_EXIST" users should be returned by the hub for room "2"

Scenario: Get users from room with missing-in-action users
	Given I let a user with username "Jim Hopper" join room "1"
	And I let a user with username "Jane Hopper" join room "1"
	And I let a user with username "Joyce Byers" join room "1"
	When user "Jane Hopper" leaves room "1"
	Then "2" users should be returned by the hub for room "1"