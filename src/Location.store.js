import { types } from 'mobx-state-tree';
import Game from 'Game.store';

const Location = types.model({
	id: types.identifier,
	name: types.string,
	longName: types.string,
	image: '',
	game: types.reference(Game),
	coords: types.array(types.integer),
});

export default Location;
