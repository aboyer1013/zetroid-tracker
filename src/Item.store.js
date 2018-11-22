import { types } from 'mobx-state-tree';
import Game from 'Game.store';

const Item = types.model({
	id: types.identifier,
	name: types.string,
	longName: types.string,
	active: false,
	image: '',
	game: types.reference(Game),
});

export default Item;
