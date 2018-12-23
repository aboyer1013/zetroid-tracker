import { types } from 'mobx-state-tree';

const GameStore = types
	.model({
		id: types.identifier,
		name: types.string,
		longName: types.string,
		selected: false,
		crossOver: types.maybeNull(types.reference(types.late(() => GameStore))),
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

export default GameStore;
