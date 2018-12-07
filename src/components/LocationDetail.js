import React, {Component} from 'react';
import ItemIconList from 'components/ItemIconList';
import {get} from 'lodash';
import classNames from 'classnames';
import {observer, inject} from 'mobx-react';
import LocationNotes from 'components/LocationNotes';

const LocationDetail = inject('store')(observer(class LocationDetail extends Component {
	render() {
		const store = get(this, 'props.store.locationDetail');
		const selectedLocation = store.selectedLocation;
		const details = get(selectedLocation, 'details');
		const numItems = get(details, 'numItems', 1);
		let longName = get(details, 'longName');
		let reqs = get(details, 'itemRequirements', []);
		let notes = get(details, 'notes');
		let isViewable = get(details, 'isViewable');
		const favoriteClasses = classNames('button', 'is-outline', {
			'has-text-warning': get(selectedLocation, 'isFavorite'),
		});
		let progressionButton;

		if (selectedLocation) {

			if (selectedLocation.isDungeonComplete || selectedLocation.isComplete) {
				progressionButton = (
					<button onClick={selectedLocation.toggleComplete} className='button is-dark'>
						<span className='icon'><i className='fas fa-check'/></span>
						<span>Complete</span>
					</button>
				);
			} else if (selectedLocation.isAvailable) {
				progressionButton = (
					<button onClick={selectedLocation.toggleComplete} className='button is-success'>
						<span className='icon'><i className='fas fa-unlock'/></span>
						<span>Available</span>
					</button>
				);
			} else {
				progressionButton = (
					<button onClick={selectedLocation.toggleComplete} className='button is-danger'>
						<span className='icon'><i className='fas fa-lock'/></span>
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
				<div className='column details-notes is-narrow'><h6>Notes:</h6><LocationNotes notes={notes}/></div>);
		}
		if (isViewable && !selectedLocation.isComplete && !selectedLocation.isAvailable) {
			isViewable = (
				<div className='tags has-addons is-marginless is-narrow'
				     title='Even though this item is not available to acquire, you can see what the item is'>
					<span className='tag is-info icon'><i className='fas fa-info'/></span>
					<span className='tag'>viewable</span>
				</div>
			);
		}
		return (
			<div
				className='is-flex-desktop columns details-container content map-info has-background-white is-marginless'>
				<div className='column details-location is-narrow'>
					<div className='details-title'>
						{longName}
					</div>
					<div className='columns'>
						<div className='column details-controls'>
							<div className='buttons'>
								<button onClick={() => selectedLocation.setFavorite(!selectedLocation.isFavorite)}
								        className={favoriteClasses}>
									<span className='icon'><i className='fas fa-star'/></span>
								</button>
								{progressionButton}
							</div>
						</div>
						<div className='column is-narrow'>
							<div className='tags-container'>
								{isViewable}
								<div className='tags has-addons is-marginless'>
									<span className='tag is-info icon'><i className='fas fa-info'/></span>
									<span className='tag'>{`${numItems} item${(numItems > 1) ? 's' : ''} here`}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='column details-requirements'>
					<h6>Requirements:</h6>
					{reqs}
				</div>
				{notes}
			</div>
		);
	}
}));

export default LocationDetail;
