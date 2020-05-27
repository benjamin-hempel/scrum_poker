Feature: Select Card

Background:
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"

Scenario: Single user selects single card
	Given I let a user with username "Jim Hopper" join room "1"
	When user "Jim Hopper" in room "1" selects card "4"
	Then user "Jim Hopper" in room "1" should have card "4" selected
	And the played cards counter in room "1" should be "1"

Scenario: Single user selects single card and deselects it
	Given I let a user with username "Jim Hopper" join room "1"
	And user "Jim Hopper" in room "1" selects card "4"
	And user "Jim Hopper" in room "1" has card "4" selected
	And the played cards counter in room "1" is "1"
	When user "Jim Hopper" in room "1" deselects their card
	Then user "Jim Hopper" in room "1" should have card "-1" selected
	And the played cards counter in room "1" should be "0"

Scenario: Single user selects and deselects several cards

Scenario: Multiple users select and deselect several cards