Feature: Reveal Cards

Scenario: Reveal Cards
	Given I have added a new room to the hub with the card deck "1,2,3,4,5,6"
	When the cards in room "1" are revealed
	Then the cards in room "1" should be revealed
