Feature: Remove User from Room
	In order to properly handle a user leaving the app
	And to keep all room data organized
	I want to remove a user from a Room.

Scenario: Remove single user from room
	Given I have created a room with the card deck "1,2,3,4,5,6"
	And I have added a new user with username "Jim Hopper" and connection ID "1" to the room
	And I have added a new user with username "Jane Hopper" and connection ID "2" to the room
	When I remove the user with username "Jim Hopper" from the room
	Then the room should contain "1" users