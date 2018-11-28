import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Item from 'Item';

const ItemList = class ItemList extends Component {
	render() {
		const store = this.props.store.itemList;
		const items = [...store.items.values()].filter(item => {
			return item.group === 'mp-upgrade' || item.name === 'hookshot' || item.maxQty > 1
		});
		const itemGroups = store.groupItems(items);
		const itemElems = [];

		for (const key of Object.keys(itemGroups)) {
			if (key !== 'none') {
				itemElems.push(
					<div key={`group-${itemGroups[key].id}`} className="item-group">
						<div className="item-container">
							{itemGroups[key].map(item => <Item key={item.id} item={item} isVisible={store.isVisible(item)} />)}
						</div>
					</div>
				);
			} else {
				{itemGroups[key].forEach((item, i) => {
					itemElems.push(
						<div key={item.id} className="item-container">
							<Item item={item} isVisible={true} />
						</div>
					);
				})}
			}
		}
		return (
			<div className="item-list-container">{itemElems}</div>
		);
	}
};

export default inject('store')(observer(ItemList));
