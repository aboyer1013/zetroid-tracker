import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Item from 'Item';
import { find, get } from 'lodash';
import classNames from 'classnames';

const DungeonList = class DungeonList extends Component {
	render() {
		const appStore = this.props.store;
		const store = this.props.itemListStore;
		const result = [];

		this.props.items.forEach((item, i) => {
			const dungeonLocation = find(appStore.dungeonLocations, loc => loc.boss.name === item.name);
			const prize = get(dungeonLocation, 'prize');

			result.push(<Item key={`${item.id}`} itemListStore={store} item={item} />);
			if (prize) {
				result.push(
					<div key={`prize-${item.id}`} className="item-container">
						{prize.items.map(subItem => <Item key={subItem.id} itemListStore={store} item={subItem} />)}
					</div>
				);
			}
		});
		return (
			<div className="item-list-container is-draggable-disabled">{result}</div>
		);
	}
};

export default inject('store')(observer(DungeonList));
