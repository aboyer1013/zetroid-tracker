import { types, getRoot } from 'mobx-state-tree';
import GameStore from 'Game.store';
import ItemStore from 'Item.store';

const LocationStore = types
	.model({
		id: types.identifier,
		name: types.string,
		longName: types.string,
		image: '',
		game: types.reference(GameStore),
		coords: types.array(types.integer),
		notes: types.optional(types.array(types.string), []),
		itemRequirements: types.optional(types.array(types.string), []),
		numItems: 1,
		isComplete: false,
		isFavorite: false,
		isDungeon: false,
		chest: types.maybeNull(ItemStore),
		numChests: types.maybe(types.integer),
		boss: types.maybe(types.reference(ItemStore)),
		prize: types.maybeNull(types.reference(ItemStore)),
		medallion: types.maybe(types.reference(ItemStore)),
	})
	.volatile(self => ({
		// All the logic to determine if the location is viewable goes here
		viewableRequirements: {
			desertpalace: () => {
				const book = getRoot(self).getItemByName('book');

				if (book.acquired) {
					return true;
				}
				const items = ['titan-mitt', 'flute', 'mirror'].map(item => getRoot(self).getItemByName(item));
				return items.every(item => item && item.acquired);
			},
		},
		// Most locations require all items to be acquired to be considered available.
		// Anything logically more complex should be defined here.
		customItemRequirements: {

		},
	}))
	.views((self) => ({
		get details() {
			return {
				longName: self.longName,
				itemRequirements: self.items,
				notes: self.notes,
				numItems: self.numItems,
				isViewable: self.isViewable,
			};
		},
		get items() {
			const result = [];

			if (self.itemRequirements.length) {
				self.itemRequirements.forEach(req => {
					result.push(getRoot(self).getItemByName(req));
				});
			}
			return result;
		},
		get defaultMarkerType() {
			return 'UNAVAILABLE';
		},
		get tooltipContent() {
			return self.longName;
		},
		get hidden() {
			if (!self.isFavorite && getRoot(self).hideCompleted && self.isComplete) {
				return true;
			}
			return false;
		},
		get isAvailable() {
			if (self.customItemRequirements[self.name]) {
				return self.customItemRequirements[self.name]();
			}
			if (!self.items.length) {
				return true;
			}
			return self.items.every(item => item && item.acquired);
		},
		get isViewable() {
			if (!self.viewableRequirements[self.name]) {
				return false;
			}
			return self.viewableRequirements[self.name]();
		},
		get isDungeonComplete() {
			return self.isDungeon && self.boss.acquired && self.chest.qty < 1;
		},
	}))
	.actions((self) => {
		const setFavorite = (newFavorite) => {
			self.isFavorite = newFavorite;
		};
		const toggleComplete = () => {
			if (self.isDungeon) {
				if (!self.isComplete) {
					self.boss.acquire(true);
					self.chest.setQty(0);
				} else {
					self.boss.acquire(false);
					self.chest.setQty(self.chest.maxQty);
				}
			}
			self.isComplete = !self.isComplete;
		};

		return {
			setFavorite,
			toggleComplete,
		};
	})
;

export default LocationStore;
