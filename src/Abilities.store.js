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
			const mpUpgrade = self.hasItem('mpupgrade');

			return (mpUpgrade && mpUpgrade.tier >= 2) || self.hasItem('bottle');
		},
		get canGetGoodBee() {
			return (
				self.hasItem('net')
				&& self.hasItem('bottle')
				&& (self.canDash || (self.hasSwordTier >= 1 && self.hasItem('quake')))
			);
		},
		get glitchedLinkInDarkWorld() {
			return self.hasItem('moonpearl') || self.hasItem('bottle');
		},
		canDefeatAgahnim: (allowOutOfLogicGlitches = false) => {
			return (
				!self.hasItem('agahnim')
				&& (self.hasItem('lantern') || allowOutOfLogicGlitches)
				&& (self.hasItem('cape') || self.hasSwordTier >= 2)
				&& (self.hasSwordTier >= 1)
			)
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
						self.hasItem('moonpearl') &&
						(
							(self.canLiftDarkRocks && (self.canDash || self.canSwim)) ||
							(self.hasItem('hammer') && self.canLiftRocks)
						)
					) {
						return true;
					}
					if (
						self.canEnterWestDeathMountain('majorGlitches', allowOutOfLogicGlitches) &&
						(
							self.hasItem('bottle') ||
							(self.hasItem('mirror') && self.canSpinSpeed) ||
							(self.hasItem('moonpearl') && (self.hasItem('mirror') || self.canDash))
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
						self.hasItem('moonpearl') &&
						(
							(self.canLiftDarkRocks && (self.canDash || self.canSwim)) ||
							(self.hasItem('hammer') && self.canLiftRocks)
						)
					) {
						return true;
					}
					if (
						self.canEnterWestDeathMountain('owGlitches', allowOutOfLogicGlitches) &&
						(
							(self.hasItem('mirror') && self.canSpinSpeed) ||
							(self.hasItem('moonpearl') && (self.hasItem('mirror') || self.canDash))
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
					if (self.hasItem('hammer') && self.canLiftRocks && self.hasItem('moonpearl')) {
						return true;
					}
					if (self.canLiftDarkRocks && self.canSwim && self.hasItem('moonpearl')) {
						return true;
					}
					if (self.canAccessDarkWorldPortal && self.canSwim && self.hasItem('moonpearl')) {
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
						self.hasItem('moonpearl') &&
						(
							self.canLiftDarkRocks ||
							(self.hasItem('hammer') && self.canLiftRocks) ||
							(
								(self.hasItem('agahnim') || (agahnimCheck && self.canDefeatAgahnim(allowOutOfLogicGlitches))) &&
								self.canGrapple &&
								(self.hasItem('hammer') || self.canLiftRocks || self.canSwim)
							)
						)
					) {
						return true;
					}
					return false;
				case 'owGlitches':
					if (
						self.canEnterWestDeathMountain('owGlitches', allowOutOfLogicGlitches) &&
						(self.hasItem('mirror') || (self.canDash && self.hasItem('moonpearl')))
					) {
						return true;
					}
					if (
						self.hasItem('moonpearl') &&
						(
							self.canLiftDarkRocks ||
							(self.hasItem('hammer') && self.canLiftRocks) ||
							(
								(self.hasItem('agahnim') || (agahnimCheck && self.canDefeatAgahnim(allowOutOfLogicGlitches))) &&
								self.canGrapple &&
								(self.hasItem('hammer') || self.canLiftRocks || self.canSwim)
							)
						)
					) {
						return true;
					}
					return false;
				default:
					if (
						self.hasItem('moonpearl') &&
						(
							(
								self.canEnterNorthEastDarkWorld(agahnimCheck, allowOutOfLogicGlitches) &&
								(
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
							self.hasItem('moonpearl') &&
							(
								self.canLiftDarkRocks ||
								(self.hasItem('hammer') && self.canLiftRocks) ||
								(
									(self.hasItem('agahnim') || (agahnimCheck && self.canDefeatAgahnim(allowOutOfLogicGlitches))) &&
									(self.hasItem('hammer') || (self.canGrapple && (self.canSwim || self.canLiftRocks)))
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
								self.hasItem('moonpearl') &&
								(
									self.canLiftDarkRocks ||
									(self.hasItem('hammer') && self.canLiftRocks) ||
									(
										self.hasItem('agahnim') &&
										(
											self.hasItem('hammer') ||
											(self.canGrapple && (self.canLiftRocks || self.canSwim))
										)
									)
								)
							) ||
							(
								(self.hasItem('mirror') || (self.canDash && self.hasItem('moonpearl'))) &&
								self.canEnterWestDeathMountain(allowOutOfLogicGlitches)
							) ||
							(self.canAccessDarkWorldPortal && self.canSwim)
						)
					) {
						return true;
					}
					return false;
				default:
					if (
						self.hasItem('moonpearl')
						&&
						(
							self.canLiftDarkRocks ||
							(self.hasItem('hammer') && self.canLiftRocks) ||
							(
								self.canEnterNorthEastDarkWorld(agahnimCheck, allowOutOfLogicGlitches) &&
								(
									self.hasItem('hammer') ||
									(self.canGrapple && (self.canSwim || self.canLiftRocks))
								)
							)
						)
					) {
						return true;
					}
					return false;
			}
		},
	}))
;
const AbilitiesStore = types.compose(ItemListUtil, MapLogicHelpers, types
	.model({
		id: types.identifier
	})
	.views(self => ({
		get items() {
			return getRoot(self).items;
		},
	}))
);

export default AbilitiesStore;
