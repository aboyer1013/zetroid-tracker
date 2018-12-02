import { types, getRoot } from 'mobx-state-tree';
import GameStore from 'Game.store';

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
		dungeonRequirements: {
			desertpalace: () => {

			},
		}
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
			if (!self.dungeonRequirements.length) {
				return false;
			}
			const dungeonReqs = self.dungeonRequirements.map(req => getRoot(self).getItemByName(req));

			return dungeonReqs.every(item => item && item.acquired);
		}
	}))
	.actions((self) => {
		const setFavorite = (newFavorite) => {
			self.isFavorite = newFavorite;
		};
		const toggleComplete = () => {
			self.isComplete = !self.isComplete;
		};

		return {
			setFavorite,
			toggleComplete,
		};
	})
;

export default LocationStore;
