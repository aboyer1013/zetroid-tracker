import { types, getRoot } from 'mobx-state-tree';
import { head } from 'lodash';

const LogicPossibility = types.model().volatile(self => {
	return {
		possibility: {
			easternPalace: {
				armos: () => self.enterability.easternPalace() && self.abilities.hasItem('bow'),
			},
			desertPalace: {
				lanmolas: area => {
					const abl = self.abilities;

					if (!abl.canLiftRocks || !abl.canLightTorches || !self.enterability.desertPalace()) {
						return false;
					}
					if (!abl.canDash && self.beatability.lanmolas()) {
						return true;
					}
				},
			},
			towerOfHera: {
				moldorm: area => {
					const abl = self.abilities;

					if (abl.hasSwordTier === 0 && !abl.hasItem('hammer')) {
						return false;
					}
					if (!self.enterability.towerOfHera()) {
						return false;
					}
					if (!abl.canLightTorches) {
						return true;
					}
					return false;
				},
			},
		},
	};
});

export default LogicPossibility;
