import React from 'react';
import {observer, inject} from 'mobx-react';
import Item from './Item';

const Dungeon = ({itemListStore, loc}) => (
	<div className='dungeon-container has-text-white is-unselectable'>
		<h6 className='dungeon-title'>{loc.longName}</h6>
		<div className='dungeon-grid-container'>
			<div className='boss'>
				<Item itemListStore={itemListStore} item={loc.boss}/>
			</div>
			<div className='prize'>
				{loc.prize.items.map(subItem => (
					<Item key={subItem.id} itemListStore={itemListStore} item={subItem}/>
				))}
			</div>
			{loc.chest && (
				<div className='chests'>
					<Item itemListStore={itemListStore} item={loc.chest}/>
				</div>
			)}
			{/*<div className='medallion'>
						{this.props.store.getItemOrGroupByName('medallion').items.map(subItem =>
							<Item key={subItem.id} itemListStore={itemListStore} item={subItem} />
						)}
					</div>*/}
		</div>
	</div>
);

export default inject('store')(observer(Dungeon));
