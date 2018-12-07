import React from 'react';
import ItemIcon from 'components/ItemIcon';
import {get} from 'lodash';
import classNames from 'classnames';
import {observer, inject} from 'mobx-react';

const ItemIconList = ({items}) => {
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

	items.forEach((item, i) => {
		if (!item) {
			return;
		}
		let iconsClasses = classNames('item-icon', {
			'is-not-acquired': !item.acquired
		});
		let iconTextClasses = classNames('item-icon-name is-size-7', {
			'is-not-acquired': !item.acquired
		});

		icons.push(
			<span key={`${item.name}-icon-${i}`} className={iconsClasses}>
        <img
	        src={item.imageSrc}
	        alt={get(item, 'longName')}
	        title={get(item, 'longName')}
        />
      </span>
		);
		iconText.push(
			<span key={`${item.name}-text-${i}`} className={iconTextClasses}>
        {item.longName}
      </span>
		);
	});
	icons.forEach((icon, i) => {
		result.push(icons[i], iconText[i]);
	});
	return <div className='item-icon-list'>{result}</div>;
};

export default inject('store')(observer(ItemIconList));
