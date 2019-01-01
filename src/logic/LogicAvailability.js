import { types, getRoot } from 'mobx-state-tree';
import { head } from 'lodash';

/*
=== DUNGEONS ONLY ===
location.dungeon:
	Only checks if you can enter the dungeon.
	You may not be able to do collect anything inside, but you can at least enter.
	AKA "canGetChest"

location[BOSS_NAME]:
	If you are able to enter the dungeon and have the ability to kill the boss.
	You could still not have the ability to open any chests.
	AKA "isBeatable"
*/

const LogicAvailability = types.model().volatile(self => {
	return {
		availability: {
			swampPalace: {
				dungeon: area => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.swampPalace()) {
						return false;
					}
					if (!abl.hasItem('hammer')) {
						return false;
					}
					return abl.canGrapple || chests.qty >= 5;
				},
				arrghus: () => {
					const abl = self.abilities;

					if (!abl.hasItem('hammer') || !abl.canGrapple) {
						return false;
					}
					return self.enterability.swampPalace();
				},
			},
			easternPalace: {
				dungeon: area => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (abl.hasItem('lantern') && abl.hasItem('bow')) {
						return true;
					}
					if (abl.hasItem('lantern') && chests.qty >= 2) {
						return true;
					}
					if (chests.qty === chests.maxQty) {
						return true;
					}
					return false;
				},
				armos: () => self.enterability.easternPalace() && self.abilities.hasItem('bow') && self.abilities.hasItem('lantern'),
			},
			desertPalace: {
				dungeon: area => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.desertPalace() || !abl.canDash) {
						return false;
					}
					if (chests.qty === chests.maxQty) {
						return true;
					}
					if (self.beatability.lanmolas() && abl.canLightTorches && abl.canLiftRocks) {
						return true;
					}
					return false;
				},
				lanmolas: () => {
					const abl = self.abilities;

					if (!abl.canLiftRocks || !abl.canLightTorches || !self.enterability.desertPalace()) {
						return false;
					}
					if (abl.canDash && self.beatability.lanmolas()) {
						return true;
					}
					return false;
				},
			},
			towerOfHera: {
				dungeon: area => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.towerOfHera()) {
						return false;
					}
					if (!abl.canLightTorches) {
						return false;
					}
					if (chests.qty === chests.maxQty || abl.hasSwordTier >= 1 || abl.hasItem('hammer')) {
						return true;
					}
					return false;
				},
				moldorm: () => {
					const abl = self.abilities;

					if (!abl.hasSwordTier === 0 && !abl.hasItem('hammer')) {
						return false;
					}
					if (!self.enterability.towerOfHera()) {
						return false;
					}
					if (abl.canLightTorches) {
						return true;
					}
					return false;
				},
			},
			palaceOfDarkness: {
				dungeon: area => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.palaceOfDarkness()) {
						return false;
					}
					if (!abl.hasItem('bow')) {
						return false;
					}
					if (chests.qty > 2 && !abl.hasItem('hammer')) {
						return false;
					}
					if (abl.hasItem('lantern')) {
						return true;
					}
					return false;
				},
				helmasaur: () => {
					const abl = self.abilities;

					if (!abl.hasItem('hammer') || !abl.hasItem('bow')) {
						return false;
					}
					if (self.enterability.palaceOfDarkness() && abl.hasItem('lantern')) {
						return true;
					}
					return false;
				},
			},
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

				// 	const abl = self.abilities;
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
				},
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
			lumberjacks: () => self.abilities.canDash && self.abilities.hasItem('agahnim'),
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
				return false;
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
			digSpot: () => self.abilities.hasItem('shovel'),
			northwestTombstone: () => {
				return (
					getRoot(self).config.gameState !== 'open'
					|| self.abilities.hasItem('lantern')
					|| self.abilities.canLiftRocks
				);
			},
			castleSecretEntrance: () => true,
			hyruleCastle: {
				castleEntrance: () => true,
				sewerDarkCross: () => getRoot(self).config.gameState !== 'open' || self.abilities.hasItem('lantern'),
			},
			sanctuaryEntrance: () => true,
			magicBat: () => {
				const abl = self.abilities;

				if (!abl.hasItem('powder')) {
					return false;
				}
				if (abl.hasItem('hammer')) {
					return true;
				}
				if (abl.hasItem('moonPearl') && abl.hasItem('mirror') && abl.canLiftDarkRocks) {
					return true;
				}
				return false;
			},
			smiths: () => self.abilities.canLiftDarkRocks && self.abilities.canEnterNorthWestDarkWorld(),
			// TODO complete once dungeons are finished.
			fatFairy: () => {
				// // Crystal check
				// let crystalCount = 0;
				// for (let k = 0; k < 10; k++) {
				// 	if (trackerData.zelda3 && trackerData.zelda3.prizes && trackerData.zelda3.prizes[k] === OJCRYSTAL && trackerData.zelda3.items["boss" + k] === 2) {
				// 		crystalCount++;
				// 		if (crystalCount === 2) {
				// 			break;
				// 		}
				// 	}
				// }
				// if (crystalCount === 2 && has("moonpearl")) {
				// 	if (canEnterSouthDarkWorld('glitchless', false, false)
				// 		&& (has("hammer") || (has("mirror") && has("agahnim")))) {
				// 		availability.glitchless = 'available';
				// 	} else if (canEnterSouthDarkWorld('glitchless', true, false)
				// 		&& (has("hammer") || (has("mirror") && canGoBeatAgahnim1(false)))) {
				// 		availability.glitchless = 'agahnim';
				// 	}
				// }
			},
			// TODO complete after dungeons are finished.
			masterSwordPedestal: () => {
				// const availability = new Availability();
				// let pendantCount = 0;
				// for (let k = 0; k < 10; k++) {
				// 	if (((trackerData.zelda3 && trackerData.zelda3.prizes && trackerData.zelda3.prizes[k] === OFFPENDANT) || (trackerData.zelda3 && trackerData.zelda3.prizes && trackerData.zelda3.prizes[k] === GREENPENDANT)) && trackerData.zelda3.items["boss" + k] === 2) {
				// 		pendantCount++;
				// 		if (pendantCount === 3) {
				// 			break;
				// 		}
				// 	}
				// }
				// if (pendantCount === 3) {
				// 	availability.glitchless = 'available';
				// }
				// else if (canRead()) {
				// 	availability.glitchless = 'possible';
				// }
			},
			waterfallFairy: () => self.abilities.canSwim,
			treasureChestMiniGame: () => self.abilities.canEnterNorthWestDarkWorld(),
		},
	};
});

export default LogicAvailability;
