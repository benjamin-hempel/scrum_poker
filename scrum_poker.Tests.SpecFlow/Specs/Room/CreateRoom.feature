﻿Feature: CreateRoom

Scenario: Create Room
	When I create a new room with the card deck "1,2,3,4,5,6"
	Then the "Id" attribute should be a GUID
	And the "CardDeck" attribute should be "1,2,3,4,5,6"
