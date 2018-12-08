import { types } from 'mobx-state-tree';
import { find, sortBy } from 'lodash';
import ConfigStore from 'Config.store';

/**
 * Utilities to assist in item retrieval targeted against the associated store's "items" property.
 * @type {IModelType<ModelPropertiesDeclarationToProperties<{}>, {} & {getItemByName: getItemByName, getItemsByGroup: getItemsByGroup, bosses: *, getItemOrGroupByName: getItemOrGroupByName, sortedItems: *, hasAcquiredAnyItemsInGroup: (function(*=): *), groupedItems: *, isVisible: (function(*): boolean), getItemGroupByName: (function(*))}, _NotCustomized, _NotCustomized>}
 */
const ItemListUtil = types.model({
		config: types.reference(ConfigStore),
	})
	.views(self => ({
		// Returns the item group
		getItemGroupByName: (group) => {
			return find([...self.items.values()], { group });
		},
		// If search matches an item group, returns it, otherwise, searches against single item names and returns that.
		getItemOrGroupByName: (name) => {
			const items = [...self.items.values()];
			const match = find(items, { group: name });

			if (match) {
				return match;
			}
			return find(items, { name });
		},
		// Gets a single item and if it's a group, search within the subitems and return the match.
		getItemByName: (name) => {
			const items = [...self.items.values()];
			let itemFound = null;

			if (!find(items, { name })) {
				const itemGroups = items.filter(item => item.group);
				if (!itemGroups) {
					return null;
				}
				itemGroups.forEach(itemGroup => {
					itemGroup.items.forEach(subItem => {
						if (subItem.name === name) {
							itemFound = subItem;
						}
					});
				});
				return itemFound;
			} else {
				return find(items, { name });
			}
		},
		// Returns all the sub items from the item group
		getItemsByGroup: (group) => {
			let itemGroup = find([...self.items.values()], { group });

			if (!itemGroup) {
				return [];
			}
			return [...itemGroup.items.values()];
		},
		hasAcquiredAnyItemsInGroup: (group) => {
			const items = self.getItemsByGroup(group);

			return items.some(item => item.acquired);
		},
		get groupedItems() {
			const result = {
				none: [],
			};

			self.sortedItems.forEach(item => {
				if (item.group) {
					if (!result[item.group]) {
						result[item.group] = [];
					}
					result[item.group].push(item);
				} else {
					result.none.push(item);
				}
			});
			// Sort grouped items by index.
			for (const groupName of Object.keys(result)) {
				if (groupName !== 'none') {
					result[groupName] = sortBy(result[groupName], ['groupIndex']);
				}
			}
			return result;
		},
		get sortedItems() {
			return sortBy([...self.items.values()], ['index']);
		},
		get bosses() {
			return self.sortedItems.filter(item => item.isBoss);
		},
		isVisible: (item) => {
			let result = false;

			if (item.isDungeonItem && item.acquired) {
				result = true;
			} else if (!item.group) {
				result = true;
			} else if (item.acquired) {
				result = true;
			} else if (self.hasAcquiredAnyItemsInGroup(item.group)) {
				result = false;
			} else if (item.isDefault) {
				result = true;
			}
			return result;
		},
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
			const foo = 'bar';
			switch (foo) {
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
			}
		}

	}))
;

export default ItemListUtil;
