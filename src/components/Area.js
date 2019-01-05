import React from 'react';
import { observer, inject } from 'mobx-react';
import Item from '~/components/Item';
import ItemSelect from '~/components/ItemSelect';
import { randomId } from '~/utilities/util';
import { includes } from 'lodash';

const Area = ({ areaStore, store }) => {
	return (
		<div className="details-area" key={randomId()}>
			<div className="details-area-title tags has-addons is-marginless">
				<span className={`tag ${areaStore.colorClass}`}>
					<span className="icon"><i className={`fas ${areaStore.iconClass}`} /></span>
				</span>
				<span className="tag">{areaStore.longName}</span>
			</div>
			<div className="details-area-collectables">
				{areaStore.canBeViewable && <ItemSelect areaStore={areaStore} />}
				{areaStore.collectables.map((collectable) => {
					const isReadOnly = !areaStore.isAvailable && !areaStore.isComplete && !areaStore.isPartiallyAvailable;

					if (collectable.group) {
						return (
							<div className="item-container" key={randomId()}>
								{collectable.items.map(subItem => (
									<Item
										key={randomId()}
										itemListStore={store}
										item={subItem}
										isReadOnly={isReadOnly && !includes(subItem.type, 'prize')}
									/>
								))}
							</div>
						);
					}
					return (
						<Item
							key={randomId()}
							itemListStore={areaStore}
							item={collectable}
							isReadOnly={isReadOnly}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default inject('store')(observer(Area));
