/* eslint-disable */
import { types, getRoot } from 'mobx-state-tree';
import { find } from 'lodash';
import ItemListUtil from 'ItemListUtil';
import ConfigStore from 'Config.store';

/**
 * Helper views to assist with map logic.
 * @type {IModelType<ModelPropertiesDeclarationToProperties<{}>, {}, _NotCustomized, _NotCustomized>}
 */
const MapLogicHelpers = types
	.model({
		config: types.reference(ConfigStore),
	})
	.views(self => ({
		hasItem(name) {
			const item = self.getItemByName(name);

			return item ? item.acquired : false;
		},
		get canDash() {
			return self.hasItem('boots');
		},
		get hasSwordTier() {
			const swords = self.getItemsByGroup('sword');
			const result = find(swords, { acquired: true });

			return result ? result.tier : 0;
		},
		get canActivateTablets() {
			return self.canRead && self.hasSwordTier >= 1;
		},
		get canActivateMedallions() {
			return self.hasSwordTier >= 1;
		},
		get canGrapple() {
			return self.hasItem('hookshot');
		},
		get canBeInvulnerable() {
			return self.hasItem('cape') || self.hasItem('byrna');
		},
		get canRead() {
			return self.hasItem('book');
		},
		get canSwim() {
			return self.hasItem('flippers');
		},
		get canLiftRocks() {
			return self.hasItem('glove') || self.hasItem('titan-mitt');
		},
		get canLiftDarkRocks() {
			return self.hasItem('titan-mitt');
		},
		get canLightTorches() {
			return self.hasItem('firerod') || self.hasItem('lantern');
		},
		get canMeltThings() {
			return self.hasItem('firerod') || (self.hasItem('bombos') || self.canActivateMedallions);
		},
		get canFly() {
			return self.hasItem('flute');
		},
		get canSpinSpeed() {
			return self.canDash && (self.hasSwordTier >= 1 || self.canGrapple);
		},
		get canShootArrows() {
			return self.hasItem('bow');
		},
		get canBlockLasers() {
			return self.hasItem('mirror-shield');
		},
		get canExtendMagic() {
			const mpUpgrade = self.getItemsByGroup('mpUpgrade');
			const result = find(mpUpgrade, { acquired: true });

			return (result && result.tier >= 2) || self.hasItem('bottle');
		},
		get canGetGoodBee() {
			return (
				self.hasItem('net')
				&& self.hasItem('bottle')
				&& (self.canDash || (self.hasSwordTier >= 1 && self.hasItem('quake')))
			);
		},
		get glitchedLinkInDarkWorld() {
			return self.hasItem('moonPearl') || self.hasItem('bottle');
		},
		canDefeatAgahnim: (allowOutOfLogicGlitches = false) => {
			return (
				!self.hasItem('agahnim')
				&& (self.hasItem('lantern') || allowOutOfLogicGlitches)
				&& (self.hasItem('cape') || self.hasSwordTier >= 2)
				&& (self.hasSwordTier >= 1)
			);
		},
		canEnterNorthEastDarkWorld: (agahnimCheck = false, allowOutOfLogicGlitches = false) => {
			switch (self.config.MAP_LOGIC) {
			case 'majorGlitches':
				if (self.hasItem('agahnim')) {
					return true;
				}
				if (agahnimCheck && self.canDefeatAgahnim(allowOutOfLogicGlitches)) {
					return true;
				}
				if (
					self.hasItem('moonPearl')
						&& (
							(self.canLiftDarkRocks && (self.canDash || self.canSwim))
							|| (self.hasItem('hammer') && self.canLiftRocks)
						)
				) {
					return true;
				}
				if (
					self.canEnterWestDeathMountain('majorGlitches', allowOutOfLogicGlitches)
						&& (
							self.hasItem('bottle')
							|| (self.hasItem('mirror') && self.canSpinSpeed)
							|| (self.hasItem('moonPearl') && (self.hasItem('mirror') || self.canDash))
						)
				) {
					return true;
				}
				return false;
			case 'owGlitches':
				if (self.hasItem('agahnim')) {
					return true;
				}
				if (agahnimCheck && self.canDefeatAgahnim(allowOutOfLogicGlitches)) {
					return true;
				}
				if (
					self.hasItem('moonPearl')
						&& (
							(self.canLiftDarkRocks && (self.canDash || self.canSwim))
							|| (self.hasItem('hammer') && self.canLiftRocks)
						)
				) {
					return true;
				}
				if (
					self.canEnterWestDeathMountain('owGlitches', allowOutOfLogicGlitches)
						&& (
							(self.hasItem('mirror') && self.canSpinSpeed)
							|| (self.hasItem('moonPearl') && (self.hasItem('mirror') || self.canDash))
						)
				) {
					return true;
				}
				return false;
			default:
				if (self.hasItem('agahnim')) {
					return true;
				}
				if (agahnimCheck && self.canDefeatAgahnim(allowOutOfLogicGlitches)) {
					return true;
				}
				if (self.hasItem('hammer') && self.canLiftRocks && self.hasItem('moonPearl')) {
					return true;
				}
				if (self.canLiftDarkRocks && self.canSwim && self.hasItem('moonPearl')) {
					return true;
				}
				if (self.canAccessDarkWorldPortal() && self.canSwim && self.hasItem('moonPearl')) {
					return true;
				}
				return false;
			}
		},
		canEnterNorthWestDarkWorld: (agahnimCheck = false, allowOutOfLogicGlitches = false) => {
			switch (self.config.MAP_LOGIC) {
			case 'majorGlitches':
				if (self.canEnterWestDeathMountain(allowOutOfLogicGlitches)) {
					return true;
				}
				if (
					self.hasItem('moonPearl')
						&& (
							self.canLiftDarkRocks
							|| (self.hasItem('hammer') && self.canLiftRocks)
							|| (
								(self.hasItem('agahnim') || (agahnimCheck && self.canDefeatAgahnim(allowOutOfLogicGlitches)))
								&& self.canGrapple
								&& (self.hasItem('hammer') || self.canLiftRocks || self.canSwim)
							)
						)
				) {
					return true;
				}
				return false;
			case 'owGlitches':
				if (
					self.canEnterWestDeathMountain('owGlitches', allowOutOfLogicGlitches)
						&& (self.hasItem('mirror') || (self.canDash && self.hasItem('moonPearl')))
				) {
					return true;
				}
				if (
					self.hasItem('moonPearl')
						&& (
							self.canLiftDarkRocks
							|| (self.hasItem('hammer') && self.canLiftRocks)
							|| (
								(self.hasItem('agahnim') || (agahnimCheck && self.canDefeatAgahnim(allowOutOfLogicGlitches)))
								&& self.canGrapple
								&& (self.hasItem('hammer') || self.canLiftRocks || self.canSwim)
							)
						)
				) {
					return true;
				}
				return false;
			default:
				if (
					self.hasItem('moonPearl')
						&& (
							(
								self.canEnterNorthEastDarkWorld(agahnimCheck, allowOutOfLogicGlitches)
								&& (
									self.canGrapple && (self.canSwim || self.canLiftRocks || self.hasItem('hammer'))
								)
							)
							|| (self.hasItem('hammer') && self.canLiftRocks)
							|| self.canLiftDarkRocks
						)
				) {
					return true;
				}
				return false;
			}
		},
		canEnterSouthDarkWorld: (agahnimCheck, allowOutOfLogicGlitches) => {
			switch (self.config.MAP_LOGIC) {
			case 'majorGlithces':
				if (self.canEnterWestDeathMountain(allowOutOfLogicGlitches)) {
					return true;
				}
				if (
					(
						self.hasItem('moonPearl')
							&& (
								self.canLiftDarkRocks
								|| (self.hasItem('hammer') && self.canLiftRocks)
								|| (
									(self.hasItem('agahnim') || (agahnimCheck && self.canDefeatAgahnim(allowOutOfLogicGlitches)))
									&& (self.hasItem('hammer') || (self.canGrapple && (self.canSwim || self.canLiftRocks)))
								)
							)
					)
				) {
					return true;
				}
				return false;
			case 'owGlitches':
				if (
					(
						(
							self.hasItem('moonPearl')
								&& (
									self.canLiftDarkRocks
									|| (self.hasItem('hammer') && self.canLiftRocks)
									|| (
										self.hasItem('agahnim')
										&& (
											self.hasItem('hammer')
											|| (self.canGrapple && (self.canLiftRocks || self.canSwim))
										)
									)
								)
						)
							|| (
								(self.hasItem('mirror') || (self.canDash && self.hasItem('moonPearl')))
								&& self.canEnterWestDeathMountain(allowOutOfLogicGlitches)
							)
							|| (self.canAccessDarkWorldPortal() && self.canSwim)
					)
				) {
					return true;
				}
				return false;
			default:
				if (
					self.hasItem('moonPearl')
						&& (
							self.canLiftDarkRocks
							|| (self.hasItem('hammer') && self.canLiftRocks)
							|| (
								self.canEnterNorthEastDarkWorld(agahnimCheck, allowOutOfLogicGlitches)
								&& (
									self.hasItem('hammer')
									|| (self.canGrapple && (self.canSwim || self.canLiftRocks))
								)
							)
						)
				) {
					return true;
				}
				return false;
			}
		},
		canEnterMireArea: (agahnimCheck = false, allowOutOfLogicGlitches = false) => {
			switch (self.config.MAP_LOGIC) {
			case 'majorGlitches':
				if (
					self.hasItem('bottle') && self.canEnterWestDeathMountain('majorGlitches', allowOutOfLogicGlitches)
						|| (self.canLiftDarkRocks && (self.canFly || self.has('bottle') || self.canDash))
						|| (self.glitchedLinkInDarkWorld && self.canDash && self.canEnterSouthDarkWorld('majorGlitches', agahnimCheck, allowOutOfLogicGlitches))
				) {
					return true;
				}
				return false;
			case 'owGlitches':
				if (
					(self.canLiftDarkRocks && (self.canFly || self.canDash))
						|| (self.hasItem('moonPearl') && self.canDash && self.canEnterSouthDarkWorld('owGlitches', agahnimCheck, allowOutOfLogicGlitches))
				) {
					return true;
				}
				return false;
			default:
				if (
					(self.canFly && self.canLiftDarkRocks) || self.canAccessMiseryMirePortal()
				) {
					return true;
				}
				return false;
			}
		},
		canEnterWestDeathMountain: (allowOutOfLogicGlitches = false) => {
			switch (self.config.MAP_LOGIC) {
			case 'majorGlitches':
				if (
					self.canDash
						|| self.has('bottle')
						|| self.canFly
						|| (self.canLiftRocks && (self.hasItem('lantern') || allowOutOfLogicGlitches))
				) {
					return true;
				}
				return false;
			case 'owGlitches':
				if (
					self.canDash
						|| self.canFly
						|| (self.canLiftRocks && (self.hasItem('lantern')) || allowOutOfLogicGlitches)
				) {
					return true;
				}
				return false;
			default:
				if (
					self.canFly
						|| (self.canLiftRocks && (self.hasItem('lantern') || allowOutOfLogicGlitches))
						|| self.canAccessDeathMountainPortal()
				) {
					return true;
				}
				return false;
			}
		},
		canEnterEastDeathMountain: (allowOutOfLogicGlitches = false) => {
			switch (self.config.MAP_LOGIC) {
			case 'majorGlitches':
				if (
					self.canDash
						|| (self.canEnterWestDeathMountain(allowOutOfLogicGlitches) && (self.canGrapple || self.hasItem('mirror')))
				) {
					return true;
				}
				return false;
			case 'owGlitches':
				if (
					self.canDash
						|| (self.canEnterWestDeathMountain(allowOutOfLogicGlitches) && (self.canGrapple || (self.hasItem('mirror') && self.hasItem('hammer'))))
				) {
					return true;
				}
				return false;
			default:
				if (
					self.canEnterWestDeathMountain(allowOutOfLogicGlitches)
						&& (self.canGrapple || (self.hasItem('mirror') && self.hasItem('hammer')))
				) {
					return true;
				}
				return false;
			}
		},
		canEnterEastDarkWorldDeathMountain: (agahnimCheck = false, allowOutOfLogicGlitches = false) => {
			switch (self.config.MAP_LOGIC) {
			case 'majorGlitches':
				if (
					self.hasItem('moonPearl')
						|| (self.hasItem('bottle') && self.canDash)
						|| ((self.canLiftDarkRocks || (self.hasItem('hammer') && self.canDash)) && self.canEnterEastDeathMountain('majorGlitches', allowOutOfLogicGlitches))
						|| (self.hasItem('mirror') && self.canEnterWestDeathMountain('majorGlitches', allowOutOfLogicGlitches))
				) {
					return true;
				}
				return false;
			case 'owGlitches':
				if (
					(self.hasItem('moonPearl') || self.canDash)
						|| (
							(self.canLiftDarkRocks || (self.hasItem('hammer') && self.canDash))
							&& self.canEnterEastDeathMountain('owGlitches', allowOutOfLogicGlitches)
						)
				) {
					return true;
				}
				return false;
			default:
				if (
					self.canLiftDarkRocks && self.canEnterEastDeathMountain(allowOutOfLogicGlitches)
				) {
					return true;
				}
				return false;
			}
		},
		// TODO - Flesh portals out once SM is created. Finish each game rando first, then figure out combining the two.
		// SM -> ALttP portals
		canAccessLightWorldPortal: () => {	// Crateria Map Room -> Link's Fortune Teller
			return true;
		},
		canAccessDeathMountainPortal: () => { // Norfair Map Room -> DM (Old Man exit)
			return true;
			// return ((canDestroyBombWalls() || canDashSM())
			// 	&& (canOpenGreenDoors() && canMorph()));
		},
		canAccessMiseryMirePortal: () => { // Lower Norfair (Golden Torizo Energy Refill) -> Mire (Great Fairy, east "Entrance")
			return true;
			// if(trackerData.metroid3.mapLogic == "casualLogic") {
			// 	return heatProof()
			// 		&& canOpenGreenDoors()
			// 		&& canOpenYellowDoors()
			// 		&& (canSwimSM() && has("space"));
			// } else if(trackerData.metroid3.mapLogic == "tourneyLogic") {
			// 	return heatProof()
			// 		&& canOpenGreenDoors()
			// 		&& (canHiJump() || canSwimSM())
			// 		&& canOpenYellowDoors();
			// }
		},
		canAccessDarkWorldPortal: () => { // Maridia Missile Refill -> DW (DW Ice Rod Right)
			return true;
			// if(trackerData.metroid3.mapLogic == "casualLogic") {
			// 	return canUsePowerBombs() && canOpenGreenDoors() && canSwimSM() && canDashSM();
			// } else if(trackerData.metroid3.mapLogic == "tourneyLogic") {
			// 	return canUsePowerBombs()
			// 		&& canOpenGreenDoors()
			// 		&& (has("charge") || (canOpenGreenDoors() && canOpenRedDoors()))
			// 		&& (canSwimSM() || (canHiJump() && has("ice") && canGrappleSM()))
			// 		&& (has("ice") || (canDashSM() && canSwimSM()));
			// }
		},
		// ALttP -> SM portals,
		canAccessCrateriaPortal: () => { // Fortune Teller -> Crateria Map Room
			return true;
		},
		canAccessNorfairPortal: () => {
			// DM (Old Man exit) -> Norfair Map Room
			// Death Mountain Access
			return self.canFly || (self.canLiftRocks && self.hasItem('lantern'));
		},
		canAccessLowerNorfairPortal: () => {
			// Mire (Great Fairy, east "Entrance") -> Lower Norfair (Golden Torizo Energy Refill)
			return self.canFly && self.canLiftDarkRocks;
		},
		canAccessMaridiaPortal: () => {
			// DW (DW Ice Rod Right) -> Maridia Missile Refill
			return true;
			// if(trackerData.metroid3.mapLogic == "casualLogic") {
			// 	return has("moonPearl")
			// 		&& canSwim()
			// 		&& canSwimSM()
			// 		&& canMorph()
			// 		&& (has("agahnim")
			// 			|| (has("hammer") && canLiftRocks())
			// 			|| canLiftDarkRocks());
			// } else if(trackerData.metroid3.mapLogic == "tourneyLogic") {
			// 	return has("moonPearl")
			// 		&& canSwim()
			// 		&& (canSpringBallJump() || canHiJump() || canSwimSM())
			// 		&& canMorph()
			// 		&& (has("agahnim")
			// 			|| (has("hammer") && canLiftRocks())
			// 			|| canLiftDarkRocks());
			// }
		},
	}));
const AbilitiesStore = types.compose(ItemListUtil, MapLogicHelpers, types
	.model({
		id: types.identifier,
	})
	.views(self => ({
		get items() {
			return getRoot(self).items;
		},
	})));

export default AbilitiesStore;
