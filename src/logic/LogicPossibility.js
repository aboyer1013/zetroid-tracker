import { types } from 'mobx-state-tree';

const LogicPossibility = types.model().volatile((self) => {
	return {
		possibility: {
			miseryMire: {
				dungeon: () => {
					if (self.enterability.miseryMire() && self.maybeHasMedallionGate) {
						return true;
					}
					return false;
				},
				vitreous: () => {
					const abl = self.abilities;

					if (!abl.hasItem('somaria') || !self.beatability.vitreous() || !abl.hasItem('lantern')) {
						return false;
					}
					if (self.hasMedallionGate && !abl.canBeInvulnerable) {
						return true;
					}
					if (self.maybeHasMedallionGate) {
						return true;
					}
					return false;
				},
			},
			easternPalace: {
				armos: () => self.enterability.easternPalace() && self.abilities.hasItem('bow'),
			},
			desertPalace: {
				lanmolas: () => {
					const abl = self.abilities;

					if (!abl.canLiftRocks || !abl.canLightTorches || !self.enterability.desertPalace()) {
						return false;
					}
					if (!abl.canDash && self.beatability.lanmolas()) {
						return true;
					}
					return false;
				},
			},
			towerOfHera: {
				moldorm: () => {
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
