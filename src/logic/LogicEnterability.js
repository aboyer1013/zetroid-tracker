import { types } from 'mobx-state-tree';

const LogicEnterability = types.model().volatile(self => {
	return {
		/*
			=== Not sure why there's the distinction between can/may ===
			hasMedallion
				Checks the medallion gate for the dungeon and has the same medallion acquired.
			mayHaveMedallion
				Checks the medallion gate for the dungeon but does not have it acquired.
			canEnter
				All the necessary acquired items to enter dungeon
				(w/hasMedallion - you know what medallion you need to enter, and have the medallion equipped)
			mayEnter
				All the necessary acquired items to enter dungeon
				(w/mayHaveMedallion - you know what the medallion you need to enter, but do not have it in possesion)
			 */
		enterability: {
			easternPalace: () => true,
			desertPalace: () => {
				const abl = self.abilities;

				if (abl.canRead) {
					return true;
				}
				if (abl.hasItem('mirror') && abl.canLiftDarkRocks && abl.canFly) {
					return true;
				}
				if (abl.canAccessMiseryMirePortal() && abl.hasItem('mirror')) {
					return true;
				}
				return false;
			},
			towerOfHera: () => {
				const abl = self.abilities;

				if (!abl.canEnterWestDeathMountain()) {
					return false;
				}
				if (abl.hasItem('mirror')) {
					return true;
				}
				if (abl.canGrapple && abl.hasItem('hammer')) {
					return true;
				}
				return false;
			},
			palaceOfDarkness: (agahnimCheck = false) => self.abilities.canEnterNorthEastDarkWorld(agahnimCheck) && self.abilities.hasItem('moonPearl'),
		},
	};
});

export default LogicEnterability;
