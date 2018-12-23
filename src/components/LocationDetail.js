import React, {Component} from 'react';
import ItemIconList from 'components/ItemIconList';
import {get} from 'lodash';
import classNames from 'classnames';
import {observer, inject} from 'mobx-react';
import LocationNotes from 'components/LocationNotes';
import Item from 'components/Item';
import { randomId } from 'utilities/util';
import Area from 'components/Area';

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
							<button onClick={this.onProgressionClickHandler} className={`button ${store.progBtnClass}`}>
								<span className="icon"><i className={`fas ${store.progBtnIcon}`} /></span>
								<span>{store.progBtnText}</span>
							</button>
						</div>
					</div>
				</div>
				<div className="details-section details-areas">
					{selectedLocation.areas.map(area => <Area key={`area-${randomId()}`} areaStore={area} selectedLocation={selectedLocation} />)}
				</div>
			</div>
		);
	}
}));

export default LocationDetail;
