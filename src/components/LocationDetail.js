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

		if (selectedLocation) {
			if (quickMarkMode && !event.ctrlKey) {
				selectedLocation.toggleComplete();
			} else if (!quickMarkMode && event.ctrlKey) {
				selectedLocation.toggleComplete();
			}
		}
	}
	render() {
		const store = get(this, 'props.store.locationDetail');
		const selectedLocation = store.selectedLocation;
		const details = get(selectedLocation, 'details');
		let longName = get(details, 'longName');
		let reqs = get(details, 'itemRequirements', []);
		let notes = get(details, 'notes');
		let isViewable = get(details, 'isViewable');
		const favoriteClasses = classNames('button', 'is-outline favorite-button', {
			'is-favorite': get(selectedLocation, 'isFavorite'),
		});
		let progressionButton;

		if (selectedLocation) {
			if (selectedLocation.isDungeonComplete || selectedLocation.isComplete || selectedLocation.areAllAreasComplete) {
				progressionButton = (
					<button onClick={this.onProgressionClickHandler} className="button is-dark">
						<span className="icon"><i className="fas fa-check-circle"/></span>
						<span>Complete</span>
					</button>
				);
			} else if (selectedLocation.isAvailable) {
				progressionButton = (
					<button onClick={this.onProgressionClickHandler} className="button is-success">
						<span className="icon"><i className="fas fa-exclamation-circle"/></span>
						<span>Available</span>
					</button>
				);
			} else if (selectedLocation.isPartiallyAvailable) {
				progressionButton = (
					<button onClick={this.onProgressionClickHandler} className="button is-warning">
						<span className="icon"><i className="fas fa-times-circle"/></span>
						<span>Unavailable</span>
					</button>
				);
			} else if (selectedLocation.isAgahnimTheOnlyRemainingRequirement) {
				progressionButton = (
					<button onClick={this.onProgressionClickHandler} className="button is-info">
						<span className="icon"><i className="fas fa-exclamation-circle"/></span>
						<span>Agahnim Must Be Defeated</span>
					</button>
				);
			} else {
				progressionButton = (
					<button onClick={this.onProgressionClickHandler} className="button is-danger">
						<span className="icon"><i className="fas fa-times-circle"/></span>
						<span>Unavailable</span>
					</button>
				);
			}
		}
		if (!details) {
			return null;
		}
		if (longName) {
			longName = <h1>{longName}</h1>;
		}
		if (reqs.length) {
			reqs = <ItemIconList items={reqs}/>;
		} else {
			reqs = <p><em>None</em></p>;
		}
		if (notes.length) {
			notes = (
				<div className="details-notes"><h6>Notes:</h6><LocationNotes notes={notes}/></div>);
		}
		if (isViewable && !selectedLocation.isComplete && !selectedLocation.isAvailable) {
			isViewable = (
				<div className="tags has-addons is-marginless is-narrow"
				     title="Even though this item is not available to acquire, you can see what the item is">
					<span className="tag is-info icon"><i className="fas fa-info"/></span>
					<span className="tag">viewable</span>
				</div>
			);
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
							{progressionButton}
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
