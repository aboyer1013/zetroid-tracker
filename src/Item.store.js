import { types, getRoot } from 'mobx-state-tree';
import GameStore from 'Game.store';

const ItemStore = types
	.model({
		id: types.identifier,
		name: types.string,
		longName: types.string,
		group: types.maybeNull(types.string),
		hidden: false,
		image: '',
		index: types.maybeNull(types.integer),
		game: types.reference(GameStore),
		acquired: false,
		maxQty: types.optional(types.integer, 1),
		isDefault: false,
	})
	.views(self => ({

	}))
	.actions(self => {
		const acquire = (newAcquired) => {
			if (self.group) {
				getRoot(self).itemList.getItemsByGroup(self.group).forEach(item => {
					item.acquired = false;
				});
			}
			self.acquired = newAcquired;
		};

		return {
			acquire,
		};
	})
;

export default ItemStore;
