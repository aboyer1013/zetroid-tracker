import { types } from 'mobx-state-tree';
import { head } from 'lodash';

const LogicPartialAvailability = types.model().volatile((self) => {
	return {
		partialAvailability: {
			ganonsTower: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);
					let smallKeysNeeded = 0;
					let bigKeyNeeded = 0;
					// Hope Room x2
					let maxAvailableChests = 2;

					// Bob's Torch
					if (abl.canDash) {
						maxAvailableChests += 1;
					}
					// DMs Room x4 + Randomizer Room x4 + Firesnake Room
					if (abl.hasItem('hammer') && abl.canGrapple) {
						maxAvailableChests += 9;
						smallKeysNeeded = 4;
					}
					// Map Chest
					if (abl.hasItem('hammer') && (abl.canDash || abl.canGrapple)) {
						maxAvailableChests += 1;
					}
					// Bob's Chest + Big Key Room x3
					if (
						(abl.hasItem('hammer') && abl.canGrapple)
						|| (abl.hasItem('firerod') && abl.hasItem('somaria'))
					) {
						maxAvailableChests += 4;
						smallKeysNeeded = Math.max(3, smallKeysNeeded);
					}
					// Tile Room
					if (abl.hasItem('somaria')) {
						maxAvailableChests += 1;
					}
					// Compass Room x4
					if (abl.hasItem('firerod') && abl.hasItem('somaria')) {
						maxAvailableChests += 4;
						smallKeysNeeded = Math.max(4, smallKeysNeeded);
					}
					// Big Chest
					if (
						abl.hasItem('hammer')
						&& abl.canDash
						&& abl.canGrapple
						&& abl.hasItem('somaria')
						&& abl.hasItem('firerod')
					) {
						maxAvailableChests += 1;
						bigKeyNeeded = 1;
					}
					// Mini Helmasaur Room x2 + Pre-Moldorm Chest
					if (abl.hasItem('bow') && abl.canLightTorches) {
						maxAvailableChests += 3;
						smallKeysNeeded = Math.max(3, smallKeysNeeded);
						bigKeyNeeded = 1;
					}
					// Moldorm Chest
					if (
						abl.canGrapple
						&& abl.hasItem('bow')
						&& abl.canLightTorches
						&& (abl.hasItem('hammer') || abl.hasSwordTier >= 1)
					) {
						maxAvailableChests += 1;
						smallKeysNeeded = Math.max(4, smallKeysNeeded);
						bigKeyNeeded = 1;
					}
					const maxItemsAvailable = Math.min(chests.maxQty, maxAvailableChests - smallKeysNeeded - bigKeyNeeded);

					return self.enterability.ganonsTower() && chests.maxQty > (chests.maxQty - maxItemsAvailable);
				},
			},
			turtleRock: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.turtleRock() || !self.hasMedallionGate) {
						return false;
					}
					if (abl.hasItem('fireRod') && chests.qty >= 2) {
						return true;
					}
					if (chests.qty >= 4) {
						return true;
					}
					if (!abl.canBeInvulnerable && !abl.canBlockLasers) {
						return false;
					}
					if (!abl.hasItem('fireRod') && abl.hasItem('lantern')) {
						return true;
					}
					if (abl.hasItem('fireRod') && abl.hasItem('lantern') && chests.qty < 2 && !self.availability.beatability.vitreous()) {
						return true;
					}
					return false;
				},
			},
			miseryMire: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.miseryMire() || !self.hasMedallionGate) {
						return false;
					}
					if (!abl.canLightTorches) {
						return true;
					}
					if (chests.qty !== chests.maxQty && chests.qty !== 1) {
						return true;
					}
					return false;
				},
			},
			icePalace: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.icePalace()) {
						return false;
					}
					if (!abl.hasItem('hammer') || !abl.canLiftRocks) {
						return true;
					}
					if (abl.canGrapple) {
						return false;
					}
					if (abl.canBeInvulnerable && chests.qty < 2) {
						return true;
					}
					return !abl.canBeInvulnerable;
				},
			},
			thievesTown: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.thievesTown()) {
						return false;
					}
					if (!abl.hasItem('hammer') && chests.qty < 3) {
						return true;
					}
					return !self.beatability.blindTheThief() || chests.qty < 2;
				},
			},
			swampPalace: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.swampPalace()) {
						return false;
					}
					if (!abl.hasItem('hammer') && chests.qty === chests.maxQty) {
						return true;
					}
					return abl.hasItem('hammer') && !self.canGrapple && chests.qty >= 3;
				},
			},
			easternPalace: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (abl.hasItem('lantern') && !abl.hasItem('bow') && chests.qty < 2) {
						return true;
					}
					return chests.qty !== chests.maxQty;
				},
			},
			desertPalace: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.desertPalace()) {
						return false;
					}
					if (!abl.canDash) {
						return true;
					}
					if (chests.qty === chests.maxQty) {
						return false;
					}
					return !self.beatability.lanmolas() || !abl.canLightTorches || !abl.canLiftRocks;
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
						return true;
					}
					return chests.qty !== chests.maxQty && abl.hasSwordTier === 0 && !abl.hasItem('hammer');
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
						return true;
					}
					if (chests.qty < 2 && !abl.hasItem('hammer')) {
						return true;
					}
					return !abl.hasItem('lantern');
				},
			},
			skullWoods: {
				dungeon: (area) => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (!self.enterability.skullWoods()) {
						return false;
					}
					if (!abl.hasItem('moonPearl')) {
						return true;
					}
					if (!abl.hasItem('fireRod')) {
						return true;
					}
					return !abl.hasSwordTier === 0 && chests.qty !== chests.maxQty;
				},
			},
		},
	};
});

export default LogicPartialAvailability;
