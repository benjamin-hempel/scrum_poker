Feature: AddUserToRoom
	In order to enable users to join the room
	And to keep all room data organized
	I want to add a new user to a Room object.

Background:
	Given I have created a room with the card deck "1,2,3,4,5,6"

Scenario: Add users to room
	When I add a new user with username "Jim Hopper" and connection ID "1" to the room
	And I add a new user with username "Jane Hopper" and connection ID "2" to the room
	Then the room should contain "2" users
	And the room should contain "2" connections
	And the first user in the room should be administrator

Scenario: Add users to all-admin room

Scenario: Add users with the same connection ID
	When I add a new user with username "Jim Hopper" and connection ID "1" to the room
	And I add a new user with username "Jane Hopper" and connection ID "1" to the room
	Then the room should contain "1" users
	And the room should contain "1" connections