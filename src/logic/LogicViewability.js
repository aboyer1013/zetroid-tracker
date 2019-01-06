import { types } from 'mobx-state-tree';

const LogicViewability = types.model().volatile((self) => {
	return {
		viewability: {
			etherTablet: () => {
				const abl = self.abilities;

				if (!abl.canRead) {
					return false;
				}
				if (!abl.canEnterWestDeathMountain()) {
					return false;
				}
				if (!abl.hasSwordTier >= 2) {
					return false;
				}
				if (abl.hasItem('mirror')) {
					return true;
				}
				return abl.hasItem('hammer') && abl.canGrapple;
			},
			bombosTablet: () => {
				const abl = self.abilities;

				return (
					abl.canRead
					&& abl.hasItem('mirror')
					&& abl.canEnterSouthDarkWorld()
				);
			},
			masterSwordPedestal: () => self.abilities.canRead,
			zoraArea: {
				ledge: () => self.abilities.canLiftRocks,
			},
			lumberjacks: () => true,
			library: () => true,
			spectacleRock: () => self.abilities.canEnterWestDeathMountain(),
			floatingIsland: () => self.abilities.canEnterEastDeathMountain(),
			desertLedge: () => true,
			bumperCave: () => self.abilities.canEnterNorthWestDarkWorld(),
		},
	};
});

export default LogicViewability;
