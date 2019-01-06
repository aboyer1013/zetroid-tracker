import { getRoot, types } from 'mobx-state-tree';
import { filter, includes } from 'lodash';

const LogicDarkWorldAvailability = types.model().volatile((self) => {
	return {
		darkWorldAvailability: {
			bombableShack: () => self.abilities.canEnterNorthWestDarkWorld(),
			cShapedHouse: () => self.abilities.canEnterNorthWestDarkWorld(),
			mireShack: () => self.abilities.canEnterMireArea() && self.abilities.hasItem('moonPearl'),
			superBunnyCave: () => {
				const abl = self.abilities;

				return (
					abl.canEnterEastDarkWorldDeathMountain(true)
					&& abl.canEnterEastDarkWorldDeathMountain()
					&& abl.hasItem('moonPearl')
				);
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
			hypeCave: () => self.abilities.canEnterSouthDarkWorld(),
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
			hauntedGrove: () => self.abilities.canEnterSouthDarkWorld(),
			catfish: () => {
				const abl = self.abilities;

				return abl.hasItem('moonPearl') && abl.canLiftRocks && abl.canEnterNorthEastDarkWorld();
			},
			hammerPegs: () => {
				const abl = self.abilities;

				return (
					abl.canLiftDarkRocks
					&& abl.hasItem('hammer')
					&& abl.canEnterNorthWestDarkWorld()
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
			smiths: () => self.abilities.canLiftDarkRocks && self.abilities.canEnterNorthWestDarkWorld(),
			fatFairy: () => {
				const abl = self.abilities;
				const { acquiredCrystals } = getRoot(self);
				const orangeCrystals = filter(acquiredCrystals, crystal => includes(crystal.type, 'orangeCrystal'));

				if (orangeCrystals.length !== 2 || !abl.hasItem('moonPearl')) {
					return false;
				}
				if (!abl.canEnterSouthDarkWorld()) {
					return false;
				}
				if (abl.hasItem('hammer')) {
					return true;
				}
				return abl.hasItem('mirror') && abl.hasItem('agahnim');
			},
			treasureChestMiniGame: () => self.abilities.canEnterNorthWestDarkWorld(),
			purpleChest: () => self.abilities.canLiftDarkRocks && self.abilities.canEnterNorthWestDarkWorld(),
			smPortalLowerNorfair: () => self.abilities.canAccessMiseryMirePortal() || self.abilities.canAccessLowerNorfairPortal(),
			smPortalMaridia: () => self.abilities.canAccessDarkWorldPortal() || self.abilities.canAccessMaridiaPortal(),
		},
	};
});

export default LogicDarkWorldAvailability;
