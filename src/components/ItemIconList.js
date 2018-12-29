import React from 'react';
import ItemIcon from 'components/ItemIcon';
import { get } from 'lodash';
import classNames from 'classnames';
import { observer, inject } from 'mobx-react';
import { randomId } from 'utilities/util';

const ItemIconList = ({ items }) => {
	if (!items) {
		return <span>None</span>;
	}
	if (items.length === 1) {
		return (
			<ItemIcon item={items[0]} checkAcquired>
				<span>{items[0].longName}</span>
			</ItemIcon>
		);
	}
	const icons = [];
	const iconText = [];
	const result = [];

	items.forEach((item) => {
		if (!item) {
			return;
		}
		const iconsClasses = classNames('item-icon', {
			'is-not-acquired': !item.acquired,
		});
		const iconTextClasses = classNames('item-icon-name is-size-7', {
			'is-not-acquired': !item.acquired,
		});

		icons.push(
			<span key={`icon-${randomId()}`} className={iconsClasses}>
				<img
					src={item.imageSrc}
					alt={get(item, 'longName')}
					title={get(item, 'longName')}
				/>
			</span>,
		);
		iconText.push(
			<span key={`text-${randomId()}`} className={iconTextClasses}>
				{item.longName}
			</span>,
		);
	});
	icons.forEach((icon, i) => {
		result.push(icons[i], iconText[i]);
	});
	return <div className="item-icon-list">{result}</div>;
};

export default inject('store')(observer(ItemIconList));
