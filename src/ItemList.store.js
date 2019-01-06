import { types, detach, getParentOfType } from 'mobx-state-tree';
import ItemStore from '~/Item.store';
import ItemListUtil from '~/ItemListUtil';
import move from 'lodash-move';

const ItemListStore = types.compose(ItemListUtil, types.model({
	id: types.identifier,
	items: types.array(ItemStore),
	sortOrder: types.optional(types.array(types.integer), []),
	droppableId: types.optional(types.string, ''),
})
	.actions((self) => {
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
			if (!itemToAdd) {
				return;
			}
			const { sortedItems } = self;
			const sourceItemList = getParentOfType(itemToAdd, ItemListStore);

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

		return {
			updateOrder,
			moveItem,
			updateIndices,
		};
	}));
export default ItemListStore;
