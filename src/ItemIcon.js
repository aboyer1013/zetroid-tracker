import React, { Component } from 'react';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

const ItemIcon = class ItemIcon extends Component {
	render() {
		const item = this.props.item;
		const imageSrc = this.props.item.imageSrc;
		const iconClasses = classNames('item-icon', {'is-not-acquired': !item.acquired && this.props.checkAcquired})

		return (
			<span className={iconClasses}>
				<img src={imageSrc} alt={get(item, 'longName')} title={get(item, 'longName')} />
				{this.props.children}
			</span>
		);
	}
}

export default inject('store')(observer(ItemIcon));
