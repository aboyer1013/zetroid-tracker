import { types } from 'mobx-state-tree';

const LogicAgahnim = types.model().volatile((self) => {
	return {
		// This will be true if the only thing preventing the location from becoming available is to defeat Agahnim.
		// TODO Not sure if I want to keep this state. Probably useful though.
		mustDefeatAgahnimFirst: {
			bombableShack: () => self.abilities.canEnterNorthWestDarkWorld(true),
			cShapedHouse: () => self.abilities.canEnterNorthWestDarkWorld(true),
			hypeCave: () => self.abilities.canEnterSouthDarkWorld(true),
			hauntedGrove: () => self.abilities.canEnterSouthDarkWorld(true),
			purpleChest: () => self.abilities.canLiftDarkRocks && self.abilities.canEnterNorthWestDarkWorld(true),
			bombosTablet: () => {
				const abl = self.abilities;

				return (
					abl.canRead
					&& abl.hasItem('mirror')
					&& abl.hasSwordTier >= 2
					&& abl.canEnterSouthDarkWorld(true)
				);
			},
			catfish: () => {
				const abl = self.abilities;

				return abl.hasItem('moonPearl') && abl.canLiftRocks && abl.canEnterNorthEastDarkWorld(true);
			},
			lumberjacks: () => self.abilities.canDash && self.abilities.canDefeatAgahnim(),
			southOfGrove: () => self.abilities.hasItem('mirror') && self.abilities.canEnterSouthDarkWorld(true),
			graveyardLedge: () => {
				const abl = self.abilities;

				return (
					abl.hasItem('mirror')
					&& abl.hasItem('moonPearl')
					&& abl.canEnterNorthWestDarkWorld(true)
				);
			},
			hammerPegs: () => {
				const abl = self.abilities;

				return (
					abl.canLiftDarkRocks
					&& abl.hasItem('hammer')
					&& abl.canEnterNorthWestDarkWorld(true)
				);
			},
			lakeHyliaIsland: () => {
				const abl = self.abilities;

				if (!abl.canEnterSouthDarkWorld(true) && !abl.canEnterNorthEastDarkWorld(true)) {
					return false;
				}
				return (
					abl.canSwim
					&& abl.hasItem('moonPearl')
					&& abl.hasItem('mirror')
				);
			},
			bumperCave: () => {
				const abl = self.abilities;

				return (
					abl.canEnterNorthWestDarkWorld(true)
					&& abl.canLiftRocks
					&& abl.hasItem('cape')
				);
			},
			pyramidLedge: () => self.abilities.canEnterNorthEastDarkWorld(true),
			diggingGame: () => self.abilities.canEnterSouthDarkWorld(true),
			smiths: () => self.abilities.canLiftDarkRocks && self.abilities.canEnterNorthWestDarkWorld(true),
			treasureChestMiniGame: () => self.abilities.canEnterNorthWestDarkWorld(true),
			palaceOfDarkness: {
				dungeon: () => self.enterability.palaceOfDarkness(true),
				helmasaur: () => {
					const abl = self.abilities;

					if (!abl.hasItem('hammer') || !abl.hasItem('bow')) {
						return false;
					}
					if (self.enterability.palaceOfDarkness(true) && abl.hasItem('lantern')) {
						return true;
					}
					return false;
				},
			},
			swampPalace: {
				dungeon: () => self.enterability.swampPalace(true),
				arrghus: () => {
					const abl = self.abilities;

					if (!abl.hasItem('hammer') || !abl.canGrapple) {
						return false;
					}
					return self.enterability.swampPalace(true);
				},
			},
			skullWoods: {
				dungeon: () => self.enterability.skullWoods(true),
				mothula: () => {
					const abl = self.abilities;

					return (
						abl.hasItem('moonPearl')
						&& abl.hasItem('fireRod')
						&& abl.hasSwordTier >= 1
						&& self.enterability.skullWoods(true)
					);
				},
			},
		},
	};
});

export default LogicAgahnim;
