import React, { Component } from 'react';
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
		let reqText = ['None'];

		if (!details || displayHelp) {
			return (
				<div className="content box map-info">
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
			reqText = reqs.map(req => req.longName);
		}
		return (
			<div className="content box map-info">
				{longName}
				<p><strong>Requirements:</strong> {reqText.join(', ')}</p>
			</div>
		);
	}
}));

export default LocationDetail;
