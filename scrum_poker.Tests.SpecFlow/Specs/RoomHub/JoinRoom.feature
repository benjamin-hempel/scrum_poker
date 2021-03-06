﻿Feature: Join Room

Scenario: Single user joins single room
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	When I let a user with username "Jim Hopper" join room "1"
	Then room "1" should contain "1" active users
	And the return value for user "Jim Hopper" should be valid JSON

Scenario: Multiple users join single room
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	When I let a user with username "Jim Hopper" join room "1"
	And I let a user with username "Jane Hopper" join room "1"
	And I let a user with username "Joyce Byers" join room "1"
	Then room "1" should contain "3" active users
	And the return value for user "Jim Hopper" should be valid JSON
	And the return value for user "Jane Hopper" should be valid JSON
	And the return value for user "Joyce Byers" should be valid JSON

Scenario: Multiple users join multiple rooms
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	And I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	When I let a user with username "Jim Hopper" join room "1"
	And I let a user with username "Jane Hopper" join room "1"
	And I let a user with username "Joyce Byers" join room "2"
	Then room "1" should contain "2" active users
	And room "2" should contain "1" active users
	And the return value for user "Jim Hopper" should be valid JSON
	And the return value for user "Jane Hopper" should be valid JSON
	And the return value for user "Joyce Byers" should be valid JSON

Scenario: User tries joining non-existing room
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	When I let a user with username "Jim Hopper" join room "2"
	Then room "1" should contain "0" active users
	And the return value for user "Jim Hopper" should be "ROOM_DOES_NOT_EXIST"