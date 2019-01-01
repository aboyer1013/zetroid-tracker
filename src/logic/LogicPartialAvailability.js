import { types } from 'mobx-state-tree';
import { head } from 'lodash';

const LogicPartialAvailability = types.model().volatile(self => {
	return {
		partialAvailability: {
			swampPalace: {
				dungeon: area => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.swampPalace()) {
						return false;
					}
					if (!abl.hasItem('hammer') && chests.qty === chests.maxQty) {
						return true;
					}
					if (abl.hasItem('hammer') && !self.canGrapple && chests.qty >= 3) {
						return true;
					}
					/*
					if (this.canEnter('glitchless', false, false)) {
						if (has("hammer")) {
							if (canGrapple() || trackerData.zelda3.dungeonchests[4] >= 5) {
								availability.glitchless = 'available';
							} else if (trackerData.zelda3.dungeonchests[4] >= 3) {
								availability.glitchless = 'partial';
							}
						} else if (trackerData.zelda3.dungeonchests[4] === 6) {
							availability.glitchless = 'partial';
						}
					}
					*/
					return false;
				},
			},
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
