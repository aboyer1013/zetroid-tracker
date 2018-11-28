import React, { Component } from 'react';
import ItemIconList from 'ItemIconList';
import { get } from 'lodash';
import classNames from 'classnames';
import { observer, inject } from 'mobx-react';

const LocationDetail = inject('store')(observer(class LocationDetail extends Component {
	constructor() {
		super();
	}
	render() {
		const store = get(this, 'props.store.locationDetail');
		const selectedLocation = store.selectedLocation;
		const displayHelp = store.displayHelp;
		const details = get(selectedLocation, 'details');
		let longName = get(details, 'longName');
		let reqs = get(details, 'itemRequirements', []);
		const favoriteClasses = classNames('button', 'is-outline', {
			'has-text-warning': get(selectedLocation, 'isFavorite'),
		});
		const mapInfoClasses = classNames('content', 'box', 'map-info', {'is-hidden': !store.isVisible});
		let progressionButton;

		if (selectedLocation) {

			switch (selectedLocation.progression) {
				case 'UNAVAILABLE':
					progressionButton = (
						<button onClick={() => store.selectedLocation.setProgression('AVAILABLE')} className="button is-danger">
							<span className="icon"><i className="fas fa-lock" /></span>
							<span>Unavailable</span>
						</button>
					);
					break;
				case 'AVAILABLE':
					progressionButton = (
						<button onClick={() => store.selectedLocation.setProgression('COMPLETE')} className="button is-success">
							<span className="icon"><i className="fas fa-unlock" /></span>
							<span>Available</span>
						</button>
					);
					break;
				case 'COMPLETE':
					progressionButton = (
						<button onClick={() => store.selectedLocation.setProgression('UNAVAILABLE')} className="button is-dark">
							<span className="icon"><i className="fas fa-check" /></span>
							<span>Complete</span>
						</button>
					);
					break;
				default:
					break;
			}
		}
		if (!details || displayHelp) {
			return (
				<div className="is-background-white">
					<div className={mapInfoClasses}>
						<h1>Help</h1>
						<ul>
							<li><em>Click map marker for more information.</em></li>
							<li><em>Shift + drag to zoom in on an area.</em></li>
							<li><em>Drag on the window title to move map.</em></li>
							<li><em>Mousewheel or <span className="icon"><i className="fas fa-search-minus" /></span><span className="icon"><i className="fas fa-search-plus" /></span> to zoom in/out.</em></li>
							<li><em>Click <span className="icon"><i className="fas fa-lock" /></span> in upper right to toggle position lock.</em></li>
						</ul>

					</div>
				</div>
			);
		}
		if (longName) {
			longName = <h1>{longName}</h1>;
		}
		if (reqs.length) {
			reqs = <ItemIconList items={reqs} />;
		}
		return (
			<div className="is-background-white">
				<div className={mapInfoClasses}>
					<div className="details-container columns">
						<div className="column">
							{longName}
							<div className="details-controls">
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
						<div className="column details-requirements">
							<h6>Requirements:</h6>
							{reqs}
						</div>
					</div>
				</div>
			</div>
		);
	}
}));

export default LocationDetail;
