import React, {Component} from 'react';
import ItemIconList from 'components/ItemIconList';
import {get} from 'lodash';
import classNames from 'classnames';
import {observer, inject} from 'mobx-react';
import LocationNotes from 'components/LocationNotes';
import Item from 'components/Item';
import { randomId } from 'utilities/util';

const LocationDetail = inject('store')(observer(class LocationDetail extends Component {
	constructor(props) {
		super(props);
		this.onProgressionClickHandler = this.onProgressionClickHandler.bind(this);
	}
	onProgressionClickHandler(event) {
		const selectedLocation = get(this, 'props.store.locationDetail.selectedLocation');
		const quickMarkMode = get(this, 'props.store.config.quickMarkMode');

		if (!selectedLocation) {
			return;
		}
		if (quickMarkMode && !event.ctrlKey) {
			selectedLocation.toggleComplete();
		} else if (!quickMarkMode && event.ctrlKey) {
			selectedLocation.toggleComplete();
		}
	}
	render() {
		const store = get(this, 'props.store.locationDetail');
		const selectedLocation = store.selectedLocation;
		const details = get(selectedLocation, 'details');
		let longName = get(details, 'longName');
		let notes = get(details, 'notes');
		const favoriteClasses = classNames('button', 'is-outline favorite-button', {
			'is-favorite': get(selectedLocation, 'isFavorite'),
		});
		let progBtnClass;
		let progBtnIcon;
		let progBtnText;

		if (selectedLocation) {
			switch (selectedLocation.currentProgression) {
				case selectedLocation.PROGRESSION.COMPLETE:
					progBtnClass = 'is-dark';
					progBtnIcon = 'fa-check-circle';
					progBtnText = 'Complete';
					break;
				case selectedLocation.PROGRESSION.AVAILABLE:
					progBtnClass = 'is-success';
					progBtnIcon = 'fa-exclamation-circle';
					progBtnText = 'Available';
					break;
				case selectedLocation.PROGRESSION.VIEWABLE:
					progBtnClass = 'is-info';
					progBtnIcon = 'fa-question-circle';
					progBtnText = 'Viewable';
					break;
				case selectedLocation.PROGRESSION.PARTIAL:
					progBtnClass = 'is-warning';
					progBtnIcon = 'fa-dot-circle';
					progBtnText = 'Partially Available';
					break;
				case selectedLocation.PROGRESSION.AGAHNIM:
					progBtnClass = 'is-info';
					progBtnIcon = 'fa-times-circle';
					progBtnText = 'Agahnim Must Be Defeated';
					break;
				case selectedLocation.PROGRESSION.POSSIBLE:
					progBtnClass = 'is-success';
					progBtnIcon = 'fa-dot-circle';
					progBtnText = 'Possible';
					break;
				default:
					progBtnClass = 'is-danger';
					progBtnIcon = 'fa-times-circle';
					progBtnText = 'Unavailable';
					break;
			}
		}
		if (!details) {
			return null;
		}
		if (longName) {
			longName = <h1>{longName}</h1>;
		}
		if (notes.length) {
			notes = (
				<div className="details-notes"><h6>Notes:</h6><LocationNotes notes={notes} /></div>);
		}
		return (
			<div className="details-container content map-info has-background-white">
				<div className="details-location details-section">
					<div className="details-title">
						{longName}
					</div>
					<div className="details-controls">
						<div className="buttons">
							<button onClick={() => selectedLocation.setFavorite(!selectedLocation.isFavorite)}
							        className={favoriteClasses}>
								<span className="icon"><i className="fas fa-star" /></span>
							</button>
							<button onClick={this.onProgressionClickHandler} className={`button ${progBtnClass}`}>
								<span className="icon"><i className={`fas ${progBtnIcon}`} /></span>
								<span>{progBtnText}</span>
							</button>
						</div>
					</div>
				</div>
				<div className="details-section details-areas">
				{selectedLocation.areas.map(area => {
					let tagClasses;
					let tagIconClasses;

					if (area.isComplete) {
						tagClasses = 'is-dark';
						tagIconClasses = 'fa-check-circle';
					} else if (area.isAvailable) {
						tagClasses = 'is-success';
						tagIconClasses = 'fa-exclamation-circle';
					} else if (area.isPossible) {
						tagClasses = 'is-success';
						tagIconClasses = 'fa-dot-circle';
					} else if (area.isViewable) {
						tagClasses = 'is-info';
						tagIconClasses = 'fa-question-circle';
					} else if (area.mustDefeatAgahnimFirst) {
						tagClasses = 'is-info';
						tagIconClasses = 'fa-times-circle';
					} else {
						tagClasses = 'is-danger';
						tagIconClasses = 'fa-times-circle';
					}
					return (
						<div className="details-area" key={randomId()}>
							<div className="details-area-title tags has-addons is-marginless">
								<span className={`tag ${tagClasses}`}>
									<span className="icon"><i className={`fas ${tagIconClasses}`}/></span>
								</span>
								<span className="tag">{area.longName}</span>
							</div>
							<div className="details-area-collectables">
								{area.collectables.map(collectable => {
									return (
										<Item
											key={randomId()}
											itemListStore={area}
											item={collectable}
											isReadOnly={!selectedLocation.isAvailable && !selectedLocation.isComplete}
										/>
									);
								})}
							</div>
						</div>
					);
				})}
				</div>
			</div>
		);
	}
}));

export default LocationDetail;
