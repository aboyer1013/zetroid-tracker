import React from 'react';
import {observer, inject} from 'mobx-react';
import Item from 'components/Item';
import ItemSelect from 'components/ItemSelect';
import { randomId } from 'utilities/util';

const Area = ({ areaStore, selectedLocation }) => {
	return (
		<div className="details-area" key={randomId()}>
			<div className="details-area-title tags has-addons is-marginless">
				<span className={`tag ${areaStore.colorClass}`}>
					<span className="icon"><i className={`fas ${areaStore.iconClass}`}/></span>
				</span>
				<span className="tag">{areaStore.longName}</span>
			</div>
			<div className="details-area-collectables">
				{areaStore.canBeViewable && <ItemSelect areaStore={areaStore} />}
				{areaStore.collectables.map(collectable => {
					return (
						<Item
							key={randomId()}
							itemListStore={areaStore}
							item={collectable}
							isReadOnly={!selectedLocation.isAvailable && !selectedLocation.isComplete}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default inject('store')(observer(Area));
