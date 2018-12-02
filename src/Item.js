import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';

const Item = class Item extends Component {
	static get defaultProps() {
		return {
			isReadOnly: false,
		};
	}
	render() {
		const { itemListStore } = this.props;
		const item = this.props.item;
		const isVisible = itemListStore.isVisible(item);
		const itemClasses = classNames('item', {
			'is-not-acquired': !item.acquired,
			'is-hidden': !isVisible,
			'is-item-group': !!item.group,
		});

		return (
			<div
				data-qty={item.qty}
				onClick={event => {
					if (!this.props.isReadOnly) {
						item.activateNext(!event.shiftKey);
					}
				}}
				key={item.id}
				className={itemClasses}>
				<img src={item.imageSrc} alt={item.longName} title={item.longName} />
			</div>
		);
	}
};

export default inject('store')(observer(Item));