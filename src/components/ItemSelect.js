import React from 'react';
import {observer, inject} from 'mobx-react';
import Item from 'components/Item';

const ItemSelect = ({ store, areaStore }) => {
	let itemElem = (
		<div className="item item-select">
			<span className="item-select-plus"><i className="fas fa-plus has-text-info" /></span>
		</div>
	);

	if (areaStore.selectedItem) {
		itemElem = (
			<Item
				isReadOnly
				itemListStore={store}
				item={areaStore.selectedItem}
			/>
		);
	}
	return (
		<div className="item-select-container" onClick={() => {
			store.setSelectedAreaStore(areaStore);
			store.openModal('ITEM_SELECT');
		}}>{itemElem}</div>
	);
};

export default inject('store')(observer(ItemSelect));
