import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';
import { find } from 'lodash';

const Dungeon = class Dungeon extends Component {
	static get defaultProps() {
		return {
			isReadOnly: false,
		};
	}
	render() {
		const { itemListStore } = this.props;
		const item = this.props.item;
		if (!item.group) {
			return null;
		}
		const isVisible = itemListStore.isVisible(item);
		const itemClasses = classNames('item', {
			'is-not-acquired': !item.acquired,
			'is-hidden': !isVisible,
			'is-item-group': !!item.group,
		});

		return null;
	}
};

export default inject('store')(observer(Dungeon));