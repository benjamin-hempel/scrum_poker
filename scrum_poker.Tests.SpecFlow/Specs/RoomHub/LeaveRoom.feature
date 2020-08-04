Feature: Leave Room

Background:
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"

Scenario: User leaves room with users left in the room
	Given I let a user with username "Jim Hopper" join room "1"
	And I let a user with username "Jane Hopper" join room "1"
	And I let a user with username "Joyce Byers" join room "1"
	When user "Jane Hopper" leaves room "1"
	Then room "1" should contain "2" active users
	And room "1" should contain "3" total users
	When I wait "31" seconds
	Then room "1" should contain "2" active users
	And room "1" should contain "2" total users

Scenario: User leaves room with no users left in the room
	Given I let a user with username "Jim Hopper" join room "1"
	When user "Jim Hopper" leaves room "1"
	Then room "1" should contain "0" active users
	And room "1" should contain "1" total users
	When I wait "31" seconds
	Then the hub should contain "0" rooms