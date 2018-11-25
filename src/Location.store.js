import { types } from 'mobx-state-tree';
import Game from 'Game.store';

const Location = types
	.model({
		id: types.identifier,
		name: types.string,
		longName: types.string,
		image: '',
		game: types.reference(Game),
		coords: types.array(types.integer),
	})
	.actions((self) => {
		const setCoords = (newCoords) => self.coords = newCoords;

		return {
			setCoords,
		};
	})
;

export default Location;
