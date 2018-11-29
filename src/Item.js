import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';

const Item = class Item extends Component {
	render() {
		const itemListStore = this.props.store.itemList;
		const item = this.props.item;
		const isVisible = itemListStore.isVisible(item);
		const itemClasses = classNames('item', {
			'is-not-acquired': !item.acquired,
			'is-hidden': !isVisible,
			'is-item-group': !!item.group,
		});

		return (
			<div onClick={item.activateNext} key={item.id} className={itemClasses}>
				<img src={item.imageSrc} alt={item.longName}/>
			</div>
		);
	}
};

export default inject('store')(observer(Item));