import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
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

		return (
			<div className="dungeon-container has-text-white is-unselectable">
				<h6 className="dungeon-title">{loc.longName}</h6>
				<div className="dungeon-grid-container">
					<div className="boss"><Item itemListStore={itemListStore} item={loc.boss} /></div>
					<div className="prize">
						{loc.prize.items.map(subItem =>
							<Item key={subItem.id} itemListStore={itemListStore} item={subItem} />
						)}
					</div>
					{chestElem}
					{/*<div className="medallion">
						{this.props.store.getItemOrGroupByName('medallion').items.map(subItem =>
							<Item key={subItem.id} itemListStore={itemListStore} item={subItem} />
						)}
					</div>*/}
				</div>
			</div>
		);
	}
};

export default inject('store')(observer(Dungeon));