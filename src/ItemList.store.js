import { types } from 'mobx-state-tree';
import ItemStore from 'Item.store';
import { find, sortBy, get } from 'lodash';
import move from 'lodash-move';

const ItemListStore = types
	.model({
		id: types.identifier,
		items: types.array(ItemStore),
		sortOrder: types.optional(types.array(types.integer), []),
	})
	.views(self => ({
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
		getItemsByGroup: (group) => {
			let itemGroup = find([...self.items.values()], { group });

			if (!itemGroup) {
				return null;
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
	.actions(self => {
		const updateOrder = (sourceItem, destItem) => {
			const sourceItemIndex = sourceItem.index;
			const destItemIndex = destItem.index;

			if (sourceItemIndex === destItemIndex) {
				return;
			}
			const swappedItems = move(self.sortedItems, sourceItemIndex, destItemIndex);

			swappedItems.forEach((item, i) => item.setIndex(i));
		};

		return {
			updateOrder,
		}
	})
;

export default ItemListStore;
