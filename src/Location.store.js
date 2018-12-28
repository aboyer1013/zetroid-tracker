import { types, getRoot } from 'mobx-state-tree';
import GameStore from 'Game.store';
import ItemStore from 'Item.store';
import MapStore from 'Map.store';
import AbilitiesStore from 'Abilities.store';
import AreaStore from 'Area.store';
import {
	isBoolean,
	isFunction,
	every,
	reject,
	some,
	isNull,
} from 'lodash';

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
	.volatile(self => {
		// All the logic to determine if the location is viewable goes here
		return {
			viewability: {
				etherTablet: () => {
					const abl = self.abilities;

					if (!abl.canRead || !abl.canEnterWestDeathMountain()) {
						return false;
					}
					if (
						abl.hasItem('mirror')
						&& abl.hasItem('hammer')
						&& abl.canGrapple
					) {
						return true;
					}
					return false;
				},
				bombosTablet: () => {
					const abl = self.abilities;

					return (
						abl.canRead
						&& abl.hasItem('mirror')
						&& abl.canEnterSouthDarkWorld()
					);
				},
				desertpalace: () => {
					// const book = getRoot(self).getItemByName('book');
					//
					// if (book.acquired) {
					// 	return true;
					// }
					// const items = ['titan-mitt', 'flute', 'mirror'].map(item => getRoot(self).getItemByName(item));
					// return items.every(item => item && item.acquired);
				},
				zoraArea: {
					ledge: () => true,
				},
				lumberjacks: () => true,
				library: () => true,
				spectacleRock: () => self.abilities.canEnterWestDeathMountain(),
				floatingIsland: () => self.abilities.canEnterEastDeathMountain(),
				desertLedge: () => true,
				bumperCave: () => self.abilities.canEnterNorthWestDarkWorld(),
			},
			possibility: {
				zoraArea: {
					ledge: () => self.abilities.canLiftRocks,
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
				hauntedGrove: () => self.abilities.canEnterSouthDarkWorld(true),
				purpleChest: () => self.abilities.canLiftDarkRocks && self.abilities.canEnterNorthWestDarkWorld(true),
				bombosTablet: () => {
					const abl = self.abilities;

					return (
						abl.canRead
						&& abl.hasItem('mirror')
						&& abl.hasSwordTier >= 2
						&& abl.canEnterSouthDarkWorld(true)
					);
				},
				catfish: () => {
					const abl = self.abilities;

					return abl.hasItem('moonPearl') && abl.canLiftRocks && abl.canEnterNorthEastDarkWorld(true);
				},
				lumberjacks: () => self.abilities.canDash && self.abilities.canDefeatAgahnim(),
				southOfGrove: () => self.abilities.hasItem('mirror') && self.abilities.canEnterSouthDarkWorld(true),
				graveyardLedge: () => {
					const abl = self.abilities;

					return (
						abl.hasItem('mirror')
						&& abl.hasItem('moonPearl')
						&& abl.canEnterNorthWestDarkWorld(true)
					);
				},
				hammerPegs: () => {
					const abl = self.abilities;

					return (
						abl.canLiftDarkRocks
						&& abl.hasItem('hammer')
						&& abl.canEnterNorthWestDarkWorld(true)
					);
				},
				lakeHyliaIsland: () => {
					const abl = self.abilities;

					if (!abl.canEnterSouthDarkWorld(true) && !abl.canEnterNorthEastDarkWorld(true)) {
						return false;
					}
					return (
						abl.canSwim
						&& abl.hasItem('moonPearl')
						&& abl.hasItem('mirror')
					);
				},
				bumperCave: () => {
					const abl = self.abilities;

					return (
						abl.canEnterNorthWestDarkWorld(true)
						&& abl.canLiftRocks
						&& abl.hasItem('cape')
					);
				},
				pyramidLedge: () => self.abilities.canEnterNorthEastDarkWorld(true),
				diggingGame: () => self.abilities.canEnterSouthDarkWorld(true),
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
				mimicCave: () => {
				// TODO Finish this after dungeons.
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

					return (
						abl.canEnterEastDarkWorldDeathMountain(true)
						&& abl.canEnterEastDarkWorldDeathMountain()
						&& abl.hasItem('moonPearl')
					);
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
				bottleVendor: () => true,
				hauntedGrove: () => self.abilities.canEnterSouthDarkWorld(),
				sickKid: () => self.abilities.hasItem('bottle'),
				purpleChest: () => self.abilities.canLiftDarkRocks && self.abilities.canEnterNorthWestDarkWorld(),
				hobo: () => self.abilities.canSwim,
				etherTablet: () => {
					const abl = self.abilities;

					if (!abl.canRead || !abl.canEnterWestDeathMountain() || abl.hasSwordTier < 2) {
						return false;
					}
					if (abl.hasItem('mirror')) {
						return true;
					}
					if (abl.hasItem('hammer') && abl.canGrapple) {
						return true;
					}
					return false;
				},
				bombosTablet: () => {
					const abl = self.abilities;

					return (
						abl.canRead
						&& abl.hasItem('mirror')
						&& abl.canEnterSouthDarkWorld()
						&& abl.hasSwordTier >= 2
					);
				},
				catfish: () => {
					const abl = self.abilities;

					return abl.hasItem('moonPearl') && abl.canLiftRocks && abl.canEnterNorthEastDarkWorld();
				},
				zoraArea: {
					kingZora: () => self.abilities.canSwim || self.abilities.canLiftRocks,
					ledge: () => self.abilities.canSwim,
				},
				oldMan: () => self.abilities.canEnterWestDeathMountain(true) && self.abilities.hasItem('lantern'),
				witchsHut: () => self.abilities.hasItem('mushroom'),
				forestHideout: () => true,
				lumberjacks:() => self.abilities.canDash && self.abilities.hasItem('agahnim'),
				spectacleRockCave: () => self.abilities.canEnterWestDeathMountain(),
				southOfGrove: () => self.abilities.hasItem('mirror') && self.abilities.canEnterSouthDarkWorld(),
				graveyardLedge: () => {
					const abl = self.abilities;

					return (
						abl.hasItem('mirror')
						&& abl.hasItem('moonPearl')
						&& abl.canEnterNorthWestDarkWorld()
					);
				},
				checkerboard: () => {
					const abl = self.abilities;

					if (!abl.hasItem('mirror')) {
						return false;
					}
					if (abl.canAccessMiseryMirePortal()) {
						return true;
					}
					if (abl.canFly && abl.canLiftDarkRocks) {
						return true;
					}
				},
				hammerPegs: () => {
					const abl = self.abilities;

					return (
						abl.canLiftDarkRocks
						&& abl.hasItem('hammer')
						&& abl.canEnterNorthWestDarkWorld()
					);
				},
				library: () => self.abilities.canDash,
				forestMushroom: () => true,
				spectacleRock: () => self.abilities.canEnterWestDeathMountain() && self.abilities.hasItem('mirror'),
				floatingIsland: () => {
					const abl = self.abilities;

					if (!abl.canEnterEastDeathMountain()) {
						return false;
					}
					return (
						abl.hasItem('mirror')
						&& abl.hasItem('moonPearl')
						&& abl.canLiftDarkRocks
					);
				},
				race: () => true,
				desertLedge: () => {
					// TODO complete once dungeons are finished
					// if (dungeons.zelda3[1].canEnter('glitchless', false, false)) {
					// 	availability.glitchless = 'available';
					// }
				},
				lakeHyliaIsland: () => {
					const abl = self.abilities;

					if (!abl.canEnterSouthDarkWorld() && !abl.canEnterNorthEastDarkWorld()) {
						return false;
					}
					return (
						abl.canSwim
						&& abl.hasItem('moonPearl')
						&& abl.hasItem('mirror')
					);
				},
				bumperCave: () => {
					const abl = self.abilities;

					return (
						abl.canEnterNorthWestDarkWorld()
						&& abl.canLiftRocks
						&& abl.hasItem('cape')
					);
				},
				pyramidLedge: () => self.abilities.canEnterNorthEastDarkWorld(),
				diggingGame: () => self.abilities.canEnterSouthDarkWorld(),
				digSpot: () => self.abilities.hasItem('shovel')
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
			return (
				!self.isAvailable
				&& !self.isViewable
				&& !self.isComplete
				&& !self.mustDefeatAgahnimFirst
				&& !self.isPossible
			);
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
			if (!isFunction(self.possibility[self.name])) {
				return false;
			}
			if (self.areAllAreasPossible) {
				return true;
			}
			return self.possibility[self.name]();
		},
		get isDungeonComplete() {
			return self.isDungeon && self.boss.acquired && self.chest.qty < 1;
		},
		get isAnyAreaViewable() {
			return some(self.areas, { canBeViewable: true });
		},
		get areAllAreasPossible() {
			return every(self.areas, { isPossible: true });
		},
		get doAllAreasHaveSelectedItems() {
			return every(self.areas, (area) => !isNull(area.selectedItem));
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
		get currentProgression() {
			if (self.isDungeonComplete || self.isComplete || self.areAllAreasComplete) {
				return self.PROGRESSION.COMPLETE;
			}
			if (self.isAvailable) {
				return self.PROGRESSION.AVAILABLE;
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
			if (self.isViewable) {
				return self.PROGRESSION.VIEWABLE;
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
