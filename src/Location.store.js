import { types, getRoot } from 'mobx-state-tree';
import GameStore from 'Game.store';
import ItemStore from 'Item.store';
import MapStore from 'Map.store';
import AbilitiesStore from 'Abilities.store';
import AreaStore from 'Area.store';
import { isBoolean, isFunction, every, reject } from 'lodash';

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
			/*
			=== Not sure why there's the distinction between can/may ===
			hasMedallion = Checks the medallion gate for the dungeon and has the same medallion acquired.
			mayHaveMedallion = Checks the medallion gate for the dungeon but does not have it acquired.
			canEnter = All the necessary acquired items to enter dungeon (w/hasMedallion - you know what medallion you need to enter, and have the medallion equipped)
			mayEnter = All the necessary acquired items to enter dungeon (w/mayHaveMedallion - you know what the medallion you need to enter, but do not have it in possesion)
			 */
			canEnterDungeon: {
				turtleRock: () => {

				},
			},
			// This will be true if the only thing preventing the location from becoming available is to defeat Agahnim.
			// TODO Not sure if I want to keep this state. Probably useful though.
			mustDefeatAgahnimFirst: {
				bombableShack: () => self.abilities.canEnterNorthWestDarkWorld(true),
				cShapedHouse: () => self.abilities.canEnterNorthWestDarkWorld(true),
				hypeCave: () => self.abilities.canEnterSouthDarkWorld(true),
				diggingGame: () => self.abilities.canEnterNorthWestDarkWorld(true),
				hauntedGrove: () => self.abilities.canEnterSouthDarkWorld(true),
				purpleChest: () => self.abilities.canLiftDarkRocks && self.abilities.canEnterNorthWestDarkWorld(true),
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
				linksHouse: () => true,
				spiralCave: () => self.abilities.canEnterEastDeathMountain(),
				// TODO Finish this after dungeons.
				mimicCave: () => {
					const abl = self.abilities;

					// if (abl.canEnterEastDeathMountain() && self.hasItem('mirror') && self.)
					//
					// if (abl.canEnterEastDeathMountain() && self.hasItem("mirror") && dungeons.zelda3[9].mayEnter("glitchless", false)) {
					// 	if (has("firerod") && dungeons.zelda3[9].canEnter("glitchless", false)) {
					// 		availability.glitchless = "available";
					// 	}
					// 	else {
					// 		availability.glitchless = "possible";
					// 	}
					// }
				},
				tavern: () => true,
				chickenHouse: () => true,
				bombableShack: () => self.abilities.canEnterNorthWestDarkWorld(),
				cShapedHouse: () => self.abilities.canEnterNorthWestDarkWorld(),
				aginahsCave: () => true,
				mireShack: () => self.abilities.canEnterMireArea() && self.abilities.hasItem('moonPearl'),
				superBunnyCave: () => {
					const abl = self.abilities;

					if (abl.canEnterEastDarkWorldDeathMountain(true)) {
						if (abl.canEnterEastDarkWorldDeathMountain() && abl.hasItem('moonPearl')) {
							return true;
						}
					}
					return false;
				},
				sahasrahlasHut: {
					cave: () => true,
					sahasrahla: () => self.abilities.hasItem('greenPendant'),
				},
				spikeCave: () => {
					const abl = self.abilities;

					return (
						abl.canLiftRocks
						&& abl.hasItem('hammer')
						&& abl.hasItem('moonPearl')
						&& abl.canEnterWestDeathMountain(true)
						&& abl.canEnterWestDeathMountain()
						&& abl.canExtendMagic
						&& abl.canBeInvulnerable
					);
				},
				kakarikoWell: () => true,
				thievesHut: () => true,
				hypeCave: () => self.abilities.canEnterSouthDarkWorld(),
				paradoxCave: () => self.abilities.canEnterEastDeathMountain(),
				bonkRocks: () => self.abilities.canDash,
				miniMoldorm: () => true,
				iceRodCave: () => true,
				hookshotCave: {
					front: () => {
						const abl = self.abilities;

						return (
							abl.hasItem('moonPearl')
							&& (abl.canGrapple || abl.canDash)
							&& abl.canEnterEastDarkWorldDeathMountain()
						);
					},
					back: () => {
						const abl = self.abilities;

						return (
							abl.hasItem('moonPearl')
							&& abl.canGrapple
							&& abl.canEnterEastDarkWorldDeathMountain()
						);
					}
				},
				diggingGame: () => self.abilities.canEnterNorthWestDarkWorld(),
				bottleVendor: () => true,
				hauntedGrove: () => self.abilities.canEnterSouthDarkWorld(),
				sickKid: () => self.abilities.hasItem('bottle'),
				purpleChest: () => self.abilities.canLiftDarkRocks && self.abilities.canEnterNorthWestDarkWorld(),
				hobo: () => self.abilities.canSwim,
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
			return !self.isAvailable && !self.isViewable && !self.isComplete && !self.mustDefeatAgahnimFirst;
		},
		get isAgahnimTheOnlyRemainingRequirement() {
			if (!self.mustDefeatAgahnimFirst[self.name]) {
				return false;
			}
			return self.mustDefeatAgahnimFirst[self.name]();
		},
		// Returns true if the location's items are ALL acquirable in ALL areas.
		get isAvailable() {
			if (!self.availability[self.name]) {
				return false;
			}
			// Dealing with multiple areas that have separate availability logic.
			if (!isFunction(self.availability[self.name])) {
				return every([...self.areas.values()], area => area.isAvailable);
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
				const numUnavailAreas = reject(areas, area => area.isAvailable).length;

				return numUnavailAreas > 0 && areas.length !== numUnavailAreas;
			}
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
			} else {
				self.isComplete = self.areAllAreasComplete;
			}
		};

		return {
			setFavorite,
			toggleComplete,
			setComplete,
		};
	})
;

export default LocationStore;
