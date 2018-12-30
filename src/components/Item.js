import React from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';
import { get } from 'lodash';

const Item = ({
	isReadOnly = false,
	item,
	itemListStore,
	isSelectMode = false,
	store,
}) => {
	const isVisible = itemListStore.isVisible(item);
	const isAcquired = (!item.isChest && item.acquired) || (item.isCollectableChest && !isReadOnly);
	const selectedItemName = get(store, 'selectedAreaStore.selectedItem.name');
	const itemClasses = classNames('item', {
		'is-not-acquired': !isAcquired,
		'is-hidden': !isVisible,
		'is-item-group': !!item.group,
		'is-read-only': isReadOnly,
		'is-unselectable': isReadOnly,
		'is-select-mode': isSelectMode,
		'is-selected': isSelectMode && selectedItemName === item.name,
	});
	let { imageSrc } = item;

	if (item.isChest && item.qty < 1) {
		imageSrc = item.imageEmptySrc;
	}

	return (
		<div
			data-qty={item.qty}
			onClick={(event) => {
				if (isReadOnly) {
					return;
				}
				const collectAll = item.isCollectableChest && !item.isDungeonItem;
				if (isSelectMode) {
					store.selectedAreaStore.selectItem(item);
					store.closeModal();
				} else if (item.isCollectableChest) {
					item.activateNext(event.shiftKey, collectAll);
					itemListStore.setComplete();
				} else if (item.isChest && item.isDungeonItem) {
					item.activateNext(event.shiftKey);
				} else {
					item.activateNext(!event.shiftKey);
				}
			}}
			key={item.id}
			className={itemClasses}
		>
			<img src={imageSrc} alt={item.longName} title={item.longName} />
		</div>
	);
};

export default inject('store')(observer(Item));
