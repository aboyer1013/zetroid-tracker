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
		viewableRequirements: types.array(types.string),
	})
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
			return getRoot(self).items.every(item => item && item.acquired);
		},
		get isViewable() {
			const reqs = self.viewableRequirements;
			// FIXME This is kinda gross
			if (reqs[0] === 'true') {
				return true;
			}
			if (reqs[0] === 'false') {
				return false;
			}
			debugger;
			const reqItems = reqs.map(req => getRoot(self).getItemByName(req));

			return reqItems.every(item => item.acquired);
		},
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
