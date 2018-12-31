import { types } from 'mobx-state-tree';

const LogicViewability = types.model().volatile(self => {
	return {
		viewability: {
			etherTablet: () => {
				const abl = self.abilities;

				if (!abl.canRead || !abl.canEnterWestDeathMountain()) {
					return false;
				}
				if (
					abl.hasItem('mirror')
					&& abl.hasItem('hammer')
					&& abl.canGrapple
				) {
					return true;
				}
				return false;
			},
			bombosTablet: () => {
				const abl = self.abilities;

				return (
					abl.canRead
					&& abl.hasItem('mirror')
					&& abl.canEnterSouthDarkWorld()
				);
			},
			desertpalace: () => {
				// const book = getRoot(self).getItemByName('book');
				//
				// if (book.acquired) {
				// 	return true;
				// }
				// const items = ['titan-mitt', 'flute', 'mirror'].map(item => getRoot(self).getItemByName(item));
				// return items.every(item => item && item.acquired);
			},
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
