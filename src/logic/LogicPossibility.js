import { types } from 'mobx-state-tree';
import { head } from 'lodash';

const LogicPossibility = types.model().volatile((self) => {
	return {
		possibility: {
			ganonsTower: {
				agahnim: () => {
					const abl = self.abilities;

					if (!abl.canGrapple || !abl.hasItem('bow') || !abl.canLightTorches) {
						return false;
					}
					if (!abl.hasItem('hammer') && !abl.hasSwordTier === 0) {
						return false;
					}
					if (!self.enterability.ganonsTower()) {
						return false;
					}
					return (
						!abl.canDash
						|| !abl.hasItem('hammer')
						|| !abl.hasItem('fireRod')
						|| !abl.hasItem('somaria')
					);
				},
			},
			turtleRock: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.turtleRock() || !self.maybeHasMedallionGate) {
						return false;
					}
					if (chests.qty >= 4) {
						return true;
					}
					if (abl.hasItem('fireRod') && chests.qty >= 2) {
						return true;
					}
					if (!abl.canBeInvulnerable && !abl.canBlockLasers) {
						return false;
					}
					if (abl.hasItem('fireRod') || abl.hasItem('lantern')) {
						return true;
					}
					return false;
				},
				trinexx: () => {
					const abl = self.abilities;

					if (!abl.hasItem('fireRod') || !abl.hasItem('iceRod') || !abl.hasItem('somaria')) {
						return false;
					}
					if (self.enterability.turtleRock() && self.maybeHasMedallionGate) {
						return true;
					}
					return false;
				},
			},
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
