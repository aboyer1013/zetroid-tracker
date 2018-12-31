import { types } from 'mobx-state-tree';
import { head } from 'lodash';

const LogicPartialAvailability = types.model().volatile(self => {
	return {
		partialAvailability: {
			easternPalace: {
				dungeon: area => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (abl.hasItem('lantern') && !abl.hasItem('bow') && chests.qty < 2) {
						return true;
					}
					if (chests.qty !== chests.maxQty) {
						return true;
					}
					return false;
				},
			},
			desertPalace: {
				dungeon: area => {
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
					if (
						!self.beatability.lanmolas()
						|| !abl.canLightTorches
						|| !abl.canLiftRocks
					) {
						return true;
					}
				},
			},
			towerOfHera: {
				dungeon: area => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.towerOfHera()) {
						return false;
					}
					if (!abl.canLightTorches) {
						return true;
					}
					if (chests.qty !== chests.maxQty && abl.hasSwordTier === 0 && !abl.hasItem('hammer')) {
						return true;
					}
					return false;
				},
			},
			palaceOfDarkness: {
				dungeon: area => {
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
					if (!abl.hasItem('lantern')) {
						return true;
					}
					return false;
				},
			},
		},
	};
});

export default LogicPartialAvailability;
