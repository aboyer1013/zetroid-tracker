import { types } from 'mobx-state-tree';
import { filter, find, sortBy } from 'lodash';
import ConfigStore from '~/Config.store';

/**
 * Utilities to assist in item retrieval targeted against the associated store's "items" property.
 * @type {IModelType<ModelPropertiesDeclarationToProperties<{}>, {} & {getItemByName: getItemByName, getItemsByGroup: getItemsByGroup, bosses: *, getItemOrGroupByName: getItemOrGroupByName, sortedItems: *, hasAcquiredAnyItemsInGroup: (function(*=): *), groupedItems: *, isVisible: (function(*): boolean), getItemGroupByName: (function(*))}, _NotCustomized, _NotCustomized>}
 */
const ItemListUtil = types.model({
	config: types.reference(ConfigStore),
})
	.views(self => ({
		// Finds the first sub item that is acquired in a given group.
		getAcquiredItemFromGroup: (group) => {
			if (!self.hasAcquiredAnyItemsInGroup(group)) {
				return false;
			}
			const itemGroup = self.getItemsByGroup(group);

			return find(itemGroup, { acquired: true });
		},
		// Returns the item group
		getItemGroupByName: (group) => {
			return find([...self.items.values()], { group });
		},
		// If search matches an item group, return it, otherwise, searches against single item names and returns that.
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
				itemGroups.forEach((itemGroup) => {
					itemGroup.items.forEach((subItem) => {
						if (subItem.name === name) {
							itemFound = subItem;
						}
					});
				});
				return itemFound;
			}
			return find(items, { name });
		},
		// Returns all the sub items from the item group
		getItemsByGroup: (group) => {
			const itemGroup = find([...self.items.values()], { group });

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

			self.sortedItems.forEach((item) => {
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
		get acquiredPrizes() {
			const prizes = filter(self.bosses.map((boss) => {
				if (!boss.acquired || !boss.dungeonLocation) {
					return false;
				}
				return boss.dungeonLocation.prize;
			}));

			return prizes.map(prize => self.getAcquiredItemFromGroup(prize.group));
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
	}));
export default ItemListUtil;
