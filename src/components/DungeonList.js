import React from 'react';
import {inject, observer} from 'mobx-react';
import Dungeon from 'components/Dungeon';
import {find} from 'lodash';

const DungeonList = ({items, store, itemListStore }) => {
	const result = [];
	// I'd move all these brains into a computed
	items.forEach((item, i) => {
		const dungeonLocation = find(
			store.dungeonLocations,
			loc => loc.boss.name === item.name
		);

		if (dungeonLocation) {
			result.push(
				<Dungeon
					key={item.id}
					loc={dungeonLocation}
					itemListStore
				/>
			);
		}
	});
	return (
		<div className='item-list-container dungeon-list-container is-draggable-disabled'>
			{result}
		</div>
	);
};

export default inject('store')(observer(DungeonList));
