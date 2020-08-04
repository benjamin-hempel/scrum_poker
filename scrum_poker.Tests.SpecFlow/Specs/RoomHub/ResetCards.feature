Feature: Reset Cards

Scenario: Reset cards
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	And I let a user with username "Jim Hopper" join room "1"
	And I let a user with username "Jane Hopper" join room "1"
	And I let a user with username "Joyce Byers" join room "1"
	And user "Jim Hopper" in room "1" selects card "4"
	And user "Jane Hopper" in room "1" selects card "6"
	And user "Joyce Byers" in room "1" selects card "1"
	When the cards in room "1" are revealed
	And the cards in room "1" are reset
	Then the cards in room "1" should not be revealed
	And user "Jim Hopper" in room "1" should have card "-1" selected
	And user "Jane Hopper" in room "1" should have card "-1" selected
	And user "Joyce Byers" in room "1" should have card "-1" selected