import { types } from 'mobx-state-tree';

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
			treasureChestMiniGame: () => self.abilities.canEnterNorthWestDarkWorld(),
			purpleChest: () => self.abilities.canLiftDarkRocks && self.abilities.canEnterNorthWestDarkWorld(),
		},
	};
});

export default LogicDarkWorldAvailability;
