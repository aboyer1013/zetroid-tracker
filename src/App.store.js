import { types } from 'mobx-state-tree';
import GameStore from './Game.store';
import ItemStore from './Item.store';
import MapStore from 'Map.store';
import { find } from 'lodash';

const AppStore = types
	.model({
		games: types.map(GameStore),
		items: types.map(ItemStore),
		maps: types.map(MapStore),
	})
	.views((self) => ({
		getGameByName: (name) => {
			return find([...self.games.values()], { name });
		},
		getMapByName: (name) => {
			return find([...self.maps.values()], { name });
		},
		getItemByName: (name) => {
			return find([...self.items.values()], { name });
		},
		get selectedGame() {
			return find([...self.games.values()], { selected: true });
		}
	}))
	.actions((self) => {
		const selectGame = (gameToSelect) => {
			const selectedGame = self.getGameByName(gameToSelect);

			[...self.games.values()].forEach((game) => {
				if (selectedGame === game) {
					game.setSelected(true);
				} else {
					game.setSelected(false);
				}
			});
		};

		return {
			selectGame,
		};
	})
;

export default AppStore;
