Feature: AddUserToRoom

Scenario: Add users to room
	Given I have created a room with the card deck "1,2,3,4,5,6"
	When I add a new user with username "Jim Hopper" and connection ID "1" to the room
	And I add a new user with username "Jane Hopper" and connection ID "2" to the room
	Then the room should contain "2" users
	And the room should contain "2" connections
	And the first user in the room should be administrator

Scenario: Add users to all-admin room
	Given I have created a room with the card deck "1,2,3,4,5,6" in which all users should be administrator
	When I add a new user with username "Jim Hopper" and connection ID "1" to the room
	And I add a new user with username "Jane Hopper" and connection ID "2" to the room
	Then the room should contain "2" users
	And the room should contain "2" connections
	Then all users in the room should be administrator

Scenario: Add users with the same connection ID
	Given I have created a room with the card deck "1,2,3,4,5,6"
	When I add a new user with username "Jim Hopper" and connection ID "1" to the room
	And I add a new user with username "Jane Hopper" and connection ID "1" to the room
	Then the room should contain "1" users
	And the room should contain "1" connections