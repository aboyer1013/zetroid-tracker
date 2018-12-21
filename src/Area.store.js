import { types, getRoot } from 'mobx-state-tree';
import GameStore from 'Game.store';
import ItemStore from 'Item.store';
import MapStore from 'Map.store';
import AbilitiesStore from 'Abilities.store';

const AreaStore = types
	.model({
		id: types.identifier,
		longName: types.string,
		isComplete: false,
		collectables: types.array(ItemStore),
		// numChests: types.maybe(types.integer),
		abilities: types.reference(AbilitiesStore),
	})
;

export default AreaStore;
