import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';
import { find } from 'lodash';
import Item from 'Item';

const Dungeon = class Dungeon extends Component {
	static get defaultProps() {
		return {
			isReadOnly: false,
		};
	}
	render() {
		const { itemListStore, loc } = this.props;
		let chestElem = null;

		if (loc.chest) {
			chestElem = (<div className="chests"><Item itemListStore={itemListStore} item={loc.chest} /></div>);
		}
		console.log(loc);

		return (
			<div className="dungeon-container has-text-white">
				<h6 className="dungeon-title">{loc.longName}</h6>
				<div className="dungeon-grid-container">
					<div className="boss"><Item itemListStore={itemListStore} item={loc.boss} /></div>
					<div className="prize">
						{loc.prize.items.map(subItem =>
							<Item key={subItem.id} itemListStore={itemListStore} item={subItem} />
						)}
					</div>
					{chestElem}
					<div className="medallion">M</div>
				</div>
			</div>
		);
	}
};

export default inject('store')(observer(Dungeon));