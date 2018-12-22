import React from 'react';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';

const Item = ({isReadOnly = false, item, itemListStore}) => {
	const isVisible = itemListStore.isVisible(item);
	const isAcquired = (!item.isChest && item.acquired) || (item.isCollectableChest && itemListStore.acquired);
	const itemClasses = classNames('item', {
		'is-not-acquired': !isAcquired,
		'is-hidden': !isVisible,
		'is-item-group': !!item.group,
		'is-read-only': isReadOnly,
	});
	let imageSrc = item.imageSrc;

	if (item.isChest && item.qty < 1) {
		imageSrc = item.imageEmptySrc;
	}

	return (
		<div
			data-qty={item.qty}
			onClick={event => {
				if (!isReadOnly) {
					if (item.isCollectableChest) {
						item.activateNext(event.shiftKey, true);
						itemListStore.setComplete();
					} else if (item.isChest && item.isDungeonItem) {
						item.activateNext(event.shiftKey);
					} else {
						item.activateNext(!event.shiftKey);
					}
				}
			}}
			key={item.id}
			className={itemClasses}
		>
			<img src={imageSrc} alt={item.longName} title={item.longName}/>
		</div>
	);
};

export default inject('store')(observer(Item));
