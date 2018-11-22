import { types } from 'mobx-state-tree';

const Game = types
	.model({
		id: types.identifier,
		name: types.string,
		longName: types.string,
		selected: false,
	})
	.actions((self) => {
		const setSelected = (state) => {
			self.selected = state;
		};

		return {
			setSelected,
		};
	})
;

export default Game;
