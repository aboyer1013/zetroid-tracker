import { types, getRoot } from 'mobx-state-tree';

const LogicLightWorldAvailability = types.model().volatile((self) => {
	return {
		lightWorldAvailability: {
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
				// 	if (has("fireRod") && dungeons.zelda3[9].canEnter("glitchless", false)) {
				// 		availability.glitchless = "available";
				// 	}
				// 	else {
				// 		availability.glitchless = "possible";
				// 	}
				// }
			},
			tavern: () => true,
			chickenHouse: () => true,
			aginahsCave: () => true,
			sahasrahlasHut: {
				cave: () => true,
				sahasrahla: () => self.abilities.hasItem('greenPendant'),
			},
			kakarikoWell: () => true,
			thievesHut: () => true,
			paradoxCave: () => self.abilities.canEnterEastDeathMountain(),
			bonkRocks: () => self.abilities.canDash,
			miniMoldorm: () => true,
			iceRodCave: () => true,
			bottleVendor: () => true,
			sickKid: () => self.abilities.hasItem('bottle'),
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
		},
	};
});

export default LogicLightWorldAvailability;
