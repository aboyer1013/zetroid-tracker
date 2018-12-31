import { types, getRoot } from 'mobx-state-tree';
import { head } from 'lodash';

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
			}
		},
	};
});

export default LogicEnterability;
