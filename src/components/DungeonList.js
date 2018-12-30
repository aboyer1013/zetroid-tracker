import React from 'react';
import { inject, observer } from 'mobx-react';
import Dungeon from '~/components/Dungeon';
import { find } from 'lodash';

const DungeonList = ({ items, store, itemListStore }) => {
	return (
		<div className="item-list-container dungeon-list-container is-draggable-disabled">
			{items.map(item => (
				item.dungeonLocation &&
				<Dungeon
					key={item.id}
					loc={item.dungeonLocation}
					itemListStore={itemListStore}
				/>
			))}
		</div>
	);
};

export default inject('store')(observer(DungeonList));
