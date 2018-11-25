import { types } from 'mobx-state-tree';
import Game from './Game.store';
import Item from './Item.store';
import { find } from 'lodash';

const AppStore = types
	.model({
		id: types.identifier,
		games: types.map(Game),
		items: types.map(Item),
	})
	.views((self) => ({
		getGameByName: (name) => {
			return find([...self.games.values()], { name });
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