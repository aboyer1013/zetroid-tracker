import { types, detach } from 'mobx-state-tree';
import ItemStore from 'Item.store';
import { find, sortBy, difference, includes, uniq } from 'lodash';
import move from 'lodash-move';

const ItemListStore = types
	.model({
		id: types.identifier,
		items: types.array(ItemStore),
		sortOrder: types.optional(types.array(types.integer), []),
		direction: types.optional(types.enumeration('Direction', ['horizontal', 'vertical']), 'horizontal'),
		droppableId: types.string,
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
		getInactiveItems: (activeItems) => {
			// TODO (aboyer) Inactive items should ALSO be from multiple games (select menu)?
			// Probably won't need this anymore - but keeping for good measure.
			// const activeItemNames = activeItems.map(item => {
			// 	if (item.group) {
			// 		return item.group;
			// 	}
			// 	return item.name;
			// });
			// const inactiveItemNames = self.sortedItems.map(item => {
			// 	if (item.group) {
			// 		return item.group;
			// 	}
			// 	return item.name;
			// });
			// console.log('activeItemNames', activeItemNames);
			// console.log('inactiveItemNames', inactiveItemNames);
			//
			// const remainingInactiveNames = difference(inactiveItemNames, activeItemNames);
			//
			// return uniq(self.sortedItems.filter(item => {
			// 	debugger;
			// 	if (item.group && includes(remainingInactiveNames, item.group)) {
			// 		return true;
			// 	}
			// 	return includes(remainingInactiveNames, item.name);
			// }));
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

			self.updateIndices(swappedItems);
		};
		const moveItem = (itemToAdd, index) => {
			const sortedItems = self.sortedItems;
			const sourceItemList = itemToAdd.itemList;

			// Add source item to destination list.
			sortedItems.splice(index, 0, detach((itemToAdd)));
			self.items.push(itemToAdd);
			// Update indices on both sides.
			itemToAdd.setIndex(index);
			sourceItemList.updateIndices(sourceItemList.sortedItems);
			self.updateIndices(sortedItems);
		};
		const updateIndices = (items) => {
			items.forEach((item, i) => item.setIndex(i));
		};
		const setDirection = newDirection => {
			self.direction = newDirection;
		};

		return {
			updateOrder,
			moveItem,
			setDirection,
			updateIndices,
		}
	})
;

export default ItemListStore;
