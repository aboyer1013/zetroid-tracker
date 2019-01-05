import { types } from 'mobx-state-tree';
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

const LogicDungeonAvailability = types.model().volatile((self) => {
	return {
		dungeonAvailability: {
			miseryMire: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.miseryMire() || !self.hasMedallionGate) {
						return false;
					}
					if (!abl.canLightTorches) {
						return false;
					}
					if (chests.qty !== chests.maxQty && chests.qty !== 1) {
						return false;
					}
					if (abl.canBeInvulnerable) {
						return true;
					}
					if (abl.hasItem('somaria') && self.beatability.vitreous()) {
						return true;
					}
					return false;
				},
				vitreous: () => {
					const abl = self.abilities;

					if (!abl.hasItem('somaria') || !self.beatability.vitreous() || !abl.hasItem('lantern')) {
						return false;
					}
					if (self.hasMedallionGate && abl.canBeInvulnerable) {
						return true;
					}
					return false;
				},
			},
			icePalace: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.icePalace() || !abl.hasItem('hammer') || !abl.canLiftRocks) {
						return false;
					}
					if (abl.canGrapple) {
						return true;
					}
					return abl.canBeInvulnerable && chests.qty >= 2;
				},
				kholdstare: () => {
					const abl = self.abilities;

					return (
						abl.canMeltThings
						&& abl.canLiftRocks
						&& abl.hasItem('hammer')
						&& self.enterability.icePalace()
						&& abl.canGrapple
						&& abl.hasItem('somaria')
					);
				},
			},
			thievesTown: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.thievesTown()) {
						return false;
					}
					if (abl.hasItem('hammer') || chests.qty >= 3) {
						return true;
					}
					return self.beatability.blindTheThief() && chests.qty >= 2;
				},
				blindTheThief: () => self.beatability.blindTheThief() && self.enterability.thievesTown(),
			},
			skullWoods: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.skullWoods() || !abl.hasItem('moonPearl') || !abl.hasItem('fireRod')) {
						return false;
					}
					return abl.hasSwordTier >= 1 || chests.qty === chests.maxQty;
				},
				mothula: () => {
					const abl = self.abilities;

					return (
						abl.hasItem('moonPearl')
						&& abl.hasItem('fireRod')
						&& abl.hasSwordTier >= 1
						&& self.enterability.skullWoods()
					);
				},
			},
			swampPalace: {
				dungeon: (area) => {
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
				dungeon: (area) => {
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
				dungeon: (area) => {
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
				dungeon: (area) => {
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
				dungeon: (area) => {
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
		},
	};
});

export default LogicDungeonAvailability;
