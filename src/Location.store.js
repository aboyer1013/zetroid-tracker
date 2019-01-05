import { types, getRoot } from 'mobx-state-tree';
import GameStore from '~/Game.store';
import ItemStore from '~/Item.store';
import MapStore from '~/Map.store';
import AbilitiesStore from '~/Abilities.store';
import LogicAvailability from '~/logic/LogicAvailability';
import LogicViewability from '~/logic/LogicViewability';
import LogicPartialAvailability from '~/logic/LogicPartialAvailability';
import LogicAgahnim from '~/logic/LogicAgahnim';
import LogicEnterability from '~/logic/LogicEnterability';
import LogicPossibility from '~/logic/LogicPossibility';
import LogicBeatability from '~/logic/LogicBeatability';
import AreaStore from '~/Area.store';
import {
	isBoolean,
	isFunction,
	some,
	every,
	reject,
	isNull,
	includes,
} from 'lodash';

const LocationStore = types.compose(
	LogicAvailability,
	LogicViewability,
	LogicPartialAvailability,
	LogicAgahnim,
	LogicEnterability,
	LogicPossibility,
	LogicBeatability,
	types.model({
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
		boss: types.maybeNull(types.reference(ItemStore)),
		prize: types.maybeNull(types.reference(ItemStore)),
		medallion: types.maybe(types.reference(ItemStore)),
		map: types.reference(types.late(() => MapStore)),
		abilities: types.reference(AbilitiesStore),
		areas: types.array(AreaStore),
		// TODO This needs to be shareable between multiple stores
		PROGRESSION: types.frozen({
			// All items are acquired.
			COMPLETE: 'COMPLETE',
			// All items are obtainable without glitches.
			AVAILABLE: 'AVAILABLE',
			// Some items, but not all, are obtainable without glitches.
			PARTIAL: 'PARTIAL',
			// The only remaining requirement to obtain all items is to defeat Agahnim.
			AGAHNIM: 'AGAHNIM',
			// Items can be obtained but include dark rooms (user does not have lantern) to get to chest.
			// There may be more scenarios where this applies.
			POSSIBLE: 'POSSIBLE',
			// Item is not obtainable but can be seen. Useful to check if item is junk or worth skipping.
			VIEWABLE: 'VIEWABLE',
			// All items are not obtainable.
			UNAVAILABLE: 'UNAVAILABLE',
		}),
	})
		.views(self => ({
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
					self.itemRequirements.forEach((req) => {
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
				if (self.isFavorite) {
					return false;
				}
				if (self.map.hideCompleted && self.isComplete) {
					return true;
				}
				if (self.map.hideUnavailable && self.isUnavailable) {
					return true;
				}
				return false;
			},
			get isUnavailable() {
				return (
					!self.isAvailable
					&& !self.isViewable
					&& !self.isComplete
					&& !self.isAgahnimTheOnlyRemainingRequirement
					&& !self.isPossible
					&& !self.isPartiallyAvailable
				);
			},
			get isAgahnimTheOnlyRemainingRequirement() {
				if (!self.mustDefeatAgahnimFirst[self.name]) {
					return false;
				}
				if (isFunction(self.mustDefeatAgahnimFirst[self.name])) {
					return self.mustDefeatAgahnimFirst[self.name]();
				}
				return some(self.areas, area => area.mustDefeatAgahnimFirst);
			},
			// Returns true if the location's items are ALL acquirable in ALL areas.
			get isAvailable() {
				if (!self.availability[self.name]) {
					return false;
				}
				// Dealing with multiple areas that have separate availability logic.
				if (!isFunction(self.availability[self.name])) {
					return every([...self.areas.values()], area => area.isAvailable || area.isComplete);
				}
				return self.availability[self.name]();
			},
			// Returns true if the location's items are acquirable in only SOME areas, but not all of them.
			get isPartiallyAvailable() {
				if (self.isAvailable) {
					return false;
				}
				// Dealing with multiple areas that have separate availability logic.
				if (!isFunction(self.availability[self.name])) {
					const areas = [...self.areas.values()];
					const nonCompleteAreas = reject(areas, area => area.isComplete);

					if (every(areas, area => area.isUnavailable)) {
						return false;
					}
					return (
						some(nonCompleteAreas, area => area.isAvailable || area.isPartiallyAvailable)
						&& !every(nonCompleteAreas, area => area.isAvailable)
					);
				}
				return false;
			},
			get isViewable() {
				let result = false;

				if (!self.viewability[self.name]) {
					result = false;
				} else if (isFunction(self.viewability[self.name])) {
					result = self.viewability[self.name]();
				}
				// User has selected all viewable items - do not flag as viewable since all of the items are now known.
				if (result && self.isAnyAreaViewable && self.doAllAreasHaveSelectedItems) {
					result = false;
				}
				return result;
			},
			get isPossible() {
				if (isFunction(self.possibility[self.name])) {
					return self.possibility[self.name]();
				}
				if (self.areAllAreasPossible) {
					return true;
				}
				return false;
			},
			get isDungeonComplete() {
				return self.isDungeon && self.boss.acquired && self.areAllAreasComplete;
			},
			get isAnyAreaViewable() {
				return some(self.areas, { canBeViewable: true });
			},
			get areAllAreasPossible() {
				return every(self.areas, area => area.isPossible || area.isComplete);
			},
			get doAllAreasHaveSelectedItems() {
				return every(self.areas, area => !isNull(area.selectedItem));
			},
			get areAllAreasComplete() {
				let result = true;

				self.areas.forEach((area) => {
					if (!area.isComplete) {
						result = false;
					}
				});
				return result;
			},
			get currentProgression() {
				if (self.isDungeonComplete || self.isComplete || self.areAllAreasComplete) {
					return self.PROGRESSION.COMPLETE;
				}
				if (self.isAvailable) {
					return self.PROGRESSION.AVAILABLE;
				}
				if (self.isViewable) {
					return self.PROGRESSION.VIEWABLE;
				}
				if (self.isPartiallyAvailable) {
					return self.PROGRESSION.PARTIAL;
				}
				if (self.isAgahnimTheOnlyRemainingRequirement) {
					return self.PROGRESSION.AGAHNIM;
				}
				if (self.isPossible) {
					return self.PROGRESSION.POSSIBLE;
				}
				return self.PROGRESSION.UNAVAILABLE;
			},
		}))
		.actions((self) => {
			const setFavorite = (newFavorite) => {
				self.isFavorite = newFavorite;
			};
			const toggleComplete = () => {
				self.isComplete = !self.isComplete;
				if (self.isComplete) {
					self.areas.forEach((area) => {
						area.collectables.forEach((collectable) => {
							if (includes(collectable.type, 'boss')) {
								collectable.acquire(true);
							} else {
								collectable.setQty(0);
							}
						});
					});
				} else {
					self.areas.forEach((area) => {
						area.collectables.forEach((collectable) => {
							if (includes(collectable.type, 'boss')) {
								collectable.acquire(false);
							} else {
								collectable.setQty(collectable.maxQty);
							}
						});
					});
				}
			};
			const setComplete = (override = null) => {
				if (isBoolean(override)) {
					self.isComplete = override;
				} else {
					self.isComplete = self.areAllAreasComplete;
				}
			};

			return {
				setFavorite,
				toggleComplete,
				setComplete,
			};
		}),
);
export default LocationStore;
