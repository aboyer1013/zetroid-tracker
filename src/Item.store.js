import { types, getRoot } from 'mobx-state-tree';
import GameStore from 'Game.store';

const ItemStore = types
	.model({
		id: types.identifier,
		// If null, is probably a group
		name: types.maybeNull(types.string),
		longName: types.maybeNull(types.string),
		group: types.maybeNull(types.string),
		items: types.optional(types.array(types.late(() => ItemStore)), []),
		hidden: false,
		image: '',
		index: types.integer,
		groupIndex: types.maybeNull(types.integer),
		game: types.reference(GameStore),
		acquired: false,
		maxQty: types.optional(types.integer, 1),
		isDefault: false,
	})
	.views(self => ({
		get imageSrc() {
			return `${process.env.PUBLIC_URL}/img/items/${self.game.name}/${self.image}.png`;
		},
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
		const setIndex = newIndex => {
			self.index = newIndex;
		};

		return {
			acquire,
			setIndex,
		};
	})
;

export default ItemStore;
