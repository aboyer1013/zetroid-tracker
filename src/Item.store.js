import { types, getParentOfType, getRoot } from 'mobx-state-tree';
import { find, includes } from 'lodash';
import GameStore from 'Game.store';
import ItemListStore from 'ItemList.store';

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
		imageEmpty: '',
		index: types.integer,
		type: types.array(types.string),
		groupIndex: types.maybeNull(types.integer),
		game: types.reference(GameStore),
		acquired: false,
		qty: types.optional(types.integer, 0),
		maxQty: types.optional(types.integer, 1),
		isDefault: false,
		tier: types.maybeNull(types.number),
		autoAcquire: false,
	})
	.views(self => ({
		get imageSrc() {
			return `${process.env.PUBLIC_URL}/img/items/${self.game.name}/${self.image}.png`;
		},
		get imageEmptySrc() {
			return `${process.env.PUBLIC_URL}/img/items/${self.game.name}/${self.imageEmpty}.png`;
		},
		get itemListOrRoot() {
			try {
				return getParentOfType(self, ItemListStore);
			} catch (error) {
				return getRoot(self);
			}
		},
		get isDungeonItem() {
			return includes(self.type, 'dungeon-item');
		},
		get isItem() {
			return includes(self.type, 'item');
		},
		get isBoss() {
			return includes(self.type, 'boss');
		},
		get isChest() {
			return includes(self.type, 'chest');
		}
	}))
	.actions(self => {
		const acquire = (newAcquired) => {
			if (self.group) {
				const itemListStore = getParentOfType(self, ItemListStore);
				itemListStore.getItemsByGroup(self.group).forEach(item => {
					item.acquired = false;
				});
			}
			self.acquired = newAcquired;
		};
		// Toggles item acquisition if not in a group, otherwise, acquires the next item in the group
		const activateNext = (forwardDirection = true) => {
			if (self.maxQty > 1 || self.isChest) {
				self.activateNextQty(forwardDirection);
				return;
			}
			if (!self.group) {
				self.toggleAcquisition();
				return;
			}

			// Collecting information first
			let shouldAcquire = true;
			const store = self.itemListOrRoot;
			const subItems = store.getItemsByGroup(self.group);
			let currentSubItem = find(subItems, { acquired: true });

			if (!currentSubItem) {
				currentSubItem = find(subItems, { isDefault: true });
			}
			if (!currentSubItem) {
				// Sensible fallback to the first item.
				currentSubItem = subItems[0];
			}
			let nextGroupIndex = forwardDirection ? currentSubItem.groupIndex + 1 : currentSubItem.groupIndex - 1;

			// Logic
			if (forwardDirection) {
				if (nextGroupIndex === subItems.length) {
					// We have wrapped around - put it back to default state.
					nextGroupIndex = 0;
					shouldAcquire = self.isDungeonItem;
				} else if (currentSubItem.isDefault && !currentSubItem.acquired) {
					currentSubItem.acquire(true);
					return;
				}
			} else if (nextGroupIndex === -1) {
				if (self.isDungeonItem) {
					nextGroupIndex = subItems.length - 1;
				} else if (currentSubItem.acquired) {
					nextGroupIndex = 0;
					shouldAcquire = false;
				} else {
					nextGroupIndex = subItems.length - 1;
				}
			}
			const nextSubItem = subItems[nextGroupIndex];
			if (nextSubItem.autoAcquire) {
				nextSubItem.acquire(true);
			} else {
				nextSubItem.acquire(shouldAcquire);
			}
		};
		const toggleAcquisition = () => {
			self.acquire(!self.acquired);
		}
		const setIndex = newIndex => {
			self.index = newIndex;
		};
		const activateNextQty = (forwardDirection = true) => {
			let nextQty = forwardDirection ? self.qty + 1 : self.qty - 1;

			if (forwardDirection) {
				if (nextQty > self.maxQty) {
					self.acquire(self.isDungeonItem);
					self.setQty(0);
				} else {
					self.acquire(true);
					self.setQty(nextQty);
				}
			} else if (nextQty < 0) {
				self.acquire(true);
				self.setQty(self.maxQty);
			} else if (nextQty === 0) {
				self.acquire(self.isDungeonItem);
				self.setQty(nextQty);
			} else {
				self.acquire(true);
				self.setQty(nextQty);
			}
		};
		const setQty = (newQty) => {
			self.qty = newQty;
		};

		return {
			acquire,
			activateNext,
			setIndex,
			toggleAcquisition,
			activateNextQty,
			setQty,
		};
	})
;

export default ItemStore;
