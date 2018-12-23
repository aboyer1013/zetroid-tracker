import React from 'react';
import {observer, inject} from 'mobx-react';
import Item from 'components/Item';
import ItemSelect from 'components/ItemSelect';
import { randomId } from 'utilities/util';

const Area = ({ areaStore, selectedLocation }) => {
	let tagClasses;
	let tagIconClasses;

	if (areaStore.isComplete) {
		tagClasses = 'is-dark';
		tagIconClasses = 'fa-check-circle';
	} else if (areaStore.isAvailable) {
		tagClasses = 'is-success';
		tagIconClasses = 'fa-exclamation-circle';
	} else if (areaStore.isPossible) {
		tagClasses = 'is-success';
		tagIconClasses = 'fa-dot-circle';
	} else if (areaStore.isViewable) {
		tagClasses = 'is-info';
		tagIconClasses = 'fa-question-circle';
	} else if (areaStore.mustDefeatAgahnimFirst) {
		tagClasses = 'is-info';
		tagIconClasses = 'fa-times-circle';
	} else {
		tagClasses = 'is-danger';
		tagIconClasses = 'fa-times-circle';
	}
	debugger;
	return (
		<div className="details-area" key={randomId()}>
			<div className="details-area-title tags has-addons is-marginless">
				<span className={`tag ${tagClasses}`}>
					<span className="icon"><i className={`fas ${tagIconClasses}`}/></span>
				</span>
				<span className="tag">{areaStore.longName}</span>
			</div>
			<div className="details-area-collectables">
				{areaStore.canBeViewable && <ItemSelect />}
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
