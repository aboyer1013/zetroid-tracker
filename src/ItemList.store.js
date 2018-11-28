import { types } from 'mobx-state-tree';
import ItemStore from 'Item.store';
import { find, sortBy } from 'lodash';

const ItemListStore = types
	.model({
		id: types.identifier,
		items: types.map(ItemStore)
	})
	.views(self => ({
		getItemByName: (name) => {
			return find([...self.items.values()], { name });
		},
		getItemsByGroup: (group) => {
			return [...self.items.values()].filter(item => item.group === group);
		},
		hasAcquiredAnyItemsInGroup: (group) => {
			const items = self.getItemsByGroup(group);

			return items.some(item => item.acquired);
		},
		groupItems: (items) => {
			const result = {
				none: [],
			};

			items.forEach(item => {
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
					result[groupName] = sortBy(result[groupName], ['index']);
				}
			}
			return result;
		},
		isVisible: (item) => {
			let result = false;

			if (item.acquired) {
				result = true;
			} else if (self.hasAcquiredAnyItemsInGroup(item.group)) {
				result = false;
			} else if (item.isDefault) {
				result = true;
			}
			return result;
		}
	}))
;

export default ItemListStore;
