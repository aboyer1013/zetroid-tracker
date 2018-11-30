import React, { Component } from 'react';
import ItemIconList from 'ItemIconList';
import { get } from 'lodash';
import classNames from 'classnames';
import { observer, inject } from 'mobx-react';
import LocationNotes from 'LocationNotes';

const LocationDetail = inject('store')(observer(class LocationDetail extends Component {
	render() {
		const store = get(this, 'props.store.locationDetail');
		const selectedLocation = store.selectedLocation;
		const details = get(selectedLocation, 'details');
		let longName = get(details, 'longName');
		let reqs = get(details, 'itemRequirements', []);
		let notes = get(details, 'notes');
		const favoriteClasses = classNames('button', 'is-outline', {
			'has-text-warning': get(selectedLocation, 'isFavorite'),
		});
		const mapInfoClasses = classNames('content', 'box', 'map-info', {
			'is-hidden': !store.isVisible,
			'is-item-list-vertical': this.props.store.itemList.direction === 'vertical',
		});
		let progressionButton;

		if (selectedLocation) {

			if (selectedLocation.isComplete) {
				progressionButton = (
					<button onClick={selectedLocation.toggleComplete} className="button is-dark">
						<span className="icon"><i className="fas fa-check" /></span>
						<span>Complete</span>
					</button>
				);
			} else if (selectedLocation.isAvailable) {
				progressionButton = (
					<button onClick={selectedLocation.toggleComplete} className="button is-success">
						<span className="icon"><i className="fas fa-unlock" /></span>
						<span>Available</span>
					</button>
				);
			} else {
				progressionButton = (
					<button onClick={selectedLocation.toggleComplete} className="button is-danger">
						<span className="icon"><i className="fas fa-lock" /></span>
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
			reqs = <ItemIconList items={reqs} />;
		}
		if (notes) {
			notes = (<div className="details-notes"><h6>Notes:</h6>{notes}</div>);
		}
		return (
			<div className="is-background-white">
				<div className={mapInfoClasses}>
					<div className="details-container">
						<div className="details-controls">
							{longName}
							<div>
								<div className="">
									<div className="buttons">
										<button onClick={() => selectedLocation.setFavorite(!selectedLocation.isFavorite)} className={favoriteClasses}>
											<span className="icon"><i className="fas fa-star" /></span>
										</button>
										{progressionButton}
									</div>
								</div>
							</div>
						</div>
						<div className="details-requirements">
							<h6>Requirements:</h6>
							{reqs}
						</div>
						{notes}
					</div>
				</div>
			</div>
		);
	}
}));

export default LocationDetail;
