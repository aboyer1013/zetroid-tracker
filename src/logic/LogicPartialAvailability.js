import { types, getRoot } from 'mobx-state-tree';
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


					// if (!canDash() || (trackerData.zelda3.dungeonchests[1] !== 2 && (!this.canHurtBoss() || !canLightTorches() || !canLiftRocks()))) {}
				}
			}
		},
	};
});

export default LogicPartialAvailability;
