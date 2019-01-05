import { types } from 'mobx-state-tree';
import { head } from 'lodash';

const LogicPartialAvailability = types.model().volatile((self) => {
	return {
		partialAvailability: {
			swampPalace: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.swampPalace()) {
						return false;
					}
					if (!abl.hasItem('hammer') && chests.qty === chests.maxQty) {
						return true;
					}
					return abl.hasItem('hammer') && !self.canGrapple && chests.qty >= 3;
				},
			},
			easternPalace: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (abl.hasItem('lantern') && !abl.hasItem('bow') && chests.qty < 2) {
						return true;
					}
					return chests.qty !== chests.maxQty;
				},
			},
			desertPalace: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.desertPalace()) {
						return false;
					}
					if (!abl.canDash) {
						return true;
					}
					if (chests.qty === chests.maxQty) {
						return false;
					}
					return !self.beatability.lanmolas() || !abl.canLightTorches || !abl.canLiftRocks;
				},
			},
			towerOfHera: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.towerOfHera()) {
						return false;
					}
					if (!abl.canLightTorches) {
						return true;
					}
					return chests.qty !== chests.maxQty && abl.hasSwordTier === 0 && !abl.hasItem('hammer');
				},
			},
			palaceOfDarkness: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.palaceOfDarkness()) {
						return false;
					}
					if (!abl.hasItem('bow')) {
						return true;
					}
					if (chests.qty < 2 && !abl.hasItem('hammer')) {
						return true;
					}
					return !abl.hasItem('lantern');
				},
			},
			skullWoods: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.skullWoods()) {
						return false;
					}
					if (!abl.hasItem('moonPearl')) {
						return true;
					}
					if (!abl.hasItem('fireRod')) {
						return true;
					}
					return !abl.hasSwordTier === 0 && chests.qty !== chests.maxQty;
				},
			},
		},
	};
});

export default LogicPartialAvailability;
