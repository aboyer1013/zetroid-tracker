import { types, getRoot } from 'mobx-state-tree';
import GameStore from 'Game.store';
import ItemStore from 'Item.store';
import MapStore from 'Map.store';
import AbilitiesStore from 'Abilities.store';
import AreaStore from 'Area.store';
import { isBoolean } from 'lodash';

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
		boss: types.maybe(types.reference(ItemStore)),
		prize: types.maybeNull(types.reference(ItemStore)),
		medallion: types.maybe(types.reference(ItemStore)),
		map: types.reference(types.late(() => MapStore)),
		abilities: types.reference(AbilitiesStore),
		areas: types.array(AreaStore),
	})
	.volatile(self => {
		// All the logic to determine if the location is viewable goes here
		return {
			viewability: {
				desertpalace: () => {
					// const book = getRoot(self).getItemByName('book');
					//
					// if (book.acquired) {
					// 	return true;
					// }
					// const items = ['titan-mitt', 'flute', 'mirror'].map(item => getRoot(self).getItemByName(item));
					// return items.every(item => item && item.acquired);
				},
			},
			availability: {
				kingsTomb: () => {
					const abl = self.abilities;

					if (abl.canDash && abl.canLiftDarkRocks) {
						return true;
					}
					if (
						abl.canDash
						&& abl.hasItem('mirror')
						&& abl.hasItem('moonpearl')
						&& abl.canEnterNorthWestDarkWorld()
					) {
						return true;
					}
					return false;
				},
				dam: () => true,
			},
		};
	})
	.views((self) => ({
		get details() {
			return {
				longName: self.longName,
				itemRequirements: self.items,
				notes: self.notes,
				numItems: self.numItems,
				isViewable: self.isViewable,
				isAvailable: self.isAvailable,
				isUnavailable: self.isUnavailable,
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
			if (!self.isFavorite) {
				if ((self.map.hideCompleted && self.isComplete) || (self.map.hideUnavailable && self.isUnavailable)) {
					return true;
				}
			}
			return false;
		},
		get isUnavailable() {
			return !self.isAvailable && !self.isViewable && !self.isComplete;
		},
		get isAvailable() {
			if (!self.availability[self.name]) {
				return false;
			}
			return self.availability[self.name]();
		},
		get isViewable() {
			if (!self.viewability[self.name]) {
				return false;
			}
			return self.viewability[self.name]();
		},
		get isDungeonComplete() {
			return self.isDungeon && self.boss.acquired && self.chest.qty < 1;
		},
		get areAllAreasComplete() {
			let result = true;

			self.areas.forEach(area => {
				if (!area.isComplete) {
					result = false;
				}
			});
			return result;
		},
	}))
	.actions((self) => {
		const setFavorite = (newFavorite) => {
			self.isFavorite = newFavorite;
		};
		const toggleComplete = () => {
			self.isComplete = !self.isComplete;
			if (self.isComplete) {
				self.areas.forEach(area => {
					area.collectables.forEach(collectable => {
						collectable.setQty(0);
						// collectable.acquire(true);
					});
				});
			} else {
				self.areas.forEach(area => {
					area.collectables.forEach(collectable => {
						collectable.setQty(collectable.maxQty);
					});
				})
			}
			// TODO add dungeon reset logic
		};
		const setComplete = (override = null) => {
			if (isBoolean(override)) {
				self.isComplete = override;
			}
			self.isComplete = self.areAllAreasComplete;
		};

		return {
			setFavorite,
			toggleComplete,
			setComplete,
		};
	})
;

export default LocationStore;
