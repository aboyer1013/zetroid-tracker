import { types } from 'mobx-state-tree';
import GameStore from 'Game.store';

const ItemStore = types.model({
	id: types.identifier,
	name: types.string,
	longName: types.string,
	active: false,
	image: '',
	game: types.reference(GameStore),
	acquired: false,
});

export default ItemStore;
