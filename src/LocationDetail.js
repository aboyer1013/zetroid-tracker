import React, { Component } from 'react';
import ItemIconList from 'ItemIconList';
import { get } from 'lodash';
import { observer, inject } from 'mobx-react';

const LocationDetail = inject('store')(observer(class LocationDetail extends Component {
	// constructor() {
	// 	super();
	// }

	render() {
		const mapStore = this.props.mapStore;
		const selectedLocation = mapStore.selectedLocation;
		const displayHelp = mapStore.displayHelp;
		const details = get(selectedLocation, 'details');
		let longName = get(details, 'longName');
		let reqs = get(details, 'itemRequirements', []);

		if (!details || displayHelp) {
			return (
				<div className="content box map-info">
					<h1>Help</h1>
					<ul>
						<li><em>Hover over a map marker for more information.</em></li>
						<li><em>Shift + drag to zoom in on an area.</em></li>
						<li><em>Drag on the window title to move map.</em></li>
						<li><em>Mousewheel or <span className="icon"><i className="fas fa-search-minus" /></span><span className="icon"><i className="fas fa-search-plus" /></span> to zoom in/out.</em></li>
						<li><em>Click <span className="icon"><i className="fas fa-lock" /></span> in upper right to toggle position lock.</em></li>
					</ul>
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
			<div className="content box map-info">
				{longName}
				<div className="details-controls is-clearfix">
					<div className="is-pulled-left">
						<div className="buttons">
							<button className="button is-success">
								<span className="icon"><i className="fas fa-unlock" /></span>
								<span>Available</span>
							</button>
							<button className="button is-danger">
								<span className="icon"><i className="fas fa-lock" /></span>
								<span>Unavailable</span>
							</button>
							<button className="button is-dark">
								<span className="icon"><i className="fas fa-check" /></span>
								<span>Complete</span>
							</button>
						</div>
					</div>
					<div className="is-pulled-right">
						<div className="buttons">
							<button className="button is-outlined is-warning">
								<span className="icon"><i className="fas fa-highlighter" /></span>
							</button>
						</div>
					</div>
				</div>
				<h6>Requirements:</h6>
				{reqs}
			</div>
		);
	}
}));

export default LocationDetail;
