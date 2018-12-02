import { types } from 'mobx-state-tree';
import { find, sortBy } from 'lodash';

const ItemListUtil = types.model()
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
		isVisible: (item) => {
			let result = false;

			if (!item.group) {
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
	}))
;

export default ItemListUtil;
