import { types, getRoot } from 'mobx-state-tree';
import { find } from 'lodash';

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
			mimicCave: {
				cave: () => {
					const abl = self.abilities;
					const dwMap = getRoot(self).getMapByName('zelda3-dw');
					const turtleRockLoc = find(dwMap.dungeonLocations, { name: 'turtleRock' });

					if (!abl.canEnterEastDeathMountain() || !abl.hasItem('mirror')) {
						return false;
					}
					if (!self.enterability.turtleRock() && !turtleRockLoc.maybeHasMedallionGate) {
						return false;
					}
					return (
						abl.hasItem('fireRod')
						&& self.enterability.turtleRock()
						&& turtleRockLoc.hasMedallionGate
					);
				},
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
				return self.enterability.desertPalace();
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
			masterSwordPedestal: () => {
				const { acquiredPendants } = getRoot(self);

				return acquiredPendants.length === 3;
			},
			waterfallFairy: () => self.abilities.canSwim,
			smPortalCrateria: () => self.abilities.canAccessLightWorldPortal() || self.abilities.canAccessCrateriaPortal(),
			smPortalNorfair: () => self.abilities.canAccessDeathMountainPortal() || self.abilities.canAccessNorfairPortal(),
		},
	};
});

export default LogicLightWorldAvailability;
