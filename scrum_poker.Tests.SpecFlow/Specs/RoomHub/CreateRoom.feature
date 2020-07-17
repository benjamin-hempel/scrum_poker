Feature: Create Room

Scenario: Add single room
	When I add a new room to the hub with the card deck "1,2,3,4,5,6"
	Then the hub should contain "1" rooms

Scenario: Add multiple rooms
	When I add a new room to the hub with the card deck "1,2,3,4,5,6"
	And I add a new room to the hub with the card deck "1,2,3,4,5,6"
	And I add a new room to the hub with the card deck "1,2,3,4,5,6"
	Then the hub should contain "3" rooms
