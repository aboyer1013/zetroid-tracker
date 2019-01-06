import React from 'react';
import { observer, inject } from 'mobx-react';

const MapHelpModal = ({ store }) => {
	const CLICK_TEXT = 'Click';
	const CTRL_CLICK_TEXT = 'Control / Command + Click';
	const detailsShortcut = store.config.quickMarkMode ? CTRL_CLICK_TEXT : CLICK_TEXT;
	const toggleCompleteShortcut = store.config.quickMarkMode ? CLICK_TEXT : CTRL_CLICK_TEXT;

	return (
		<div className="modal-card">
			<header className="modal-card-head">
				<p className="modal-card-title">Map Legend</p>
				<button
					type="button"
					className="delete"
					aria-label="close"
					onClick={store.closeModal}
				/>
			</header>
			<section className="modal-card-body">
				<div className="content">
					<h4>Help</h4>
					<ul>
						<li>{detailsShortcut} map marker for more information (shown on Details panel).</li>
						<li>{toggleCompleteShortcut} map marker to toggle completed locations.</li>
						<li>Shift + drag to zoom in on an area. This is enabled if zooming is locked.</li>
						<li>Mousewheel / Pinch to zoom.</li>
					</ul>
					<h4>Legend</h4>
					<div className="columns">
						<div className="column is-narrow">
							<div className="awesome-marker-icon-red awesome-marker icon legend-marker">
								<i className="fas fa fa-times-circle icon-white" />
							</div>
						</div>
						<div className="column">
							<p><strong>Unavailable.</strong><br />
								Item cannot be acquired at the location including all sub-areas.
							</p>
						</div>
					</div>
					<div className="columns">
						<div className="column is-narrow">
							<div className="awesome-marker-icon-green awesome-marker icon legend-marker">
								<i className="fas fa fa-exclamation-circle icon-white" />
							</div>
						</div>
						<div className="column">
							<p><strong>Available.</strong><br />
								Item can be acquired at the location including all sub-areas.
							</p>
						</div>
					</div>
					<div className="columns">
						<div className="column is-narrow">
							<div className="awesome-marker-icon-orange awesome-marker icon legend-marker">
								<i className="fas fa fa-dot-circle icon-white" />
							</div>
						</div>
						<div className="column">
							<p><strong>Partially available.</strong><br />
								At least one of the location’s sub-areas are available but not all of them.
							</p>
						</div>
					</div>
					<div className="columns">
						<div className="column is-narrow">
							<div className="awesome-marker-icon-black awesome-marker icon legend-marker">
								<i className="fas fa fa-check-circle icon-white" />
							</div>
						</div>
						<div className="column">
							<p><strong>Completed.</strong><br />
								All items within its location are acquired.
							</p>
						</div>
					</div>
					<div className="columns">
						<div className="column is-narrow">
							<div className="awesome-marker-icon-blue awesome-marker icon legend-marker">
								<i className="fas fa fa-question-circle icon-white" />
							</div>
						</div>
						<div className="column">
							<p><strong>Viewable.</strong><br />
								Item is able to be viewed but not available.
							</p>
						</div>
					</div>
					<div className="columns">
						<div className="column is-narrow">
							<div className="awesome-marker-icon-green awesome-marker icon legend-marker">
								<i className="fas fa fa-dot-circle icon-white" />
							</div>
						</div>
						<div className="column">
							<p><strong>Possible.</strong><br />
								Item is possible to acquire but may need to access dark rooms to get there.
							</p>
						</div>
					</div>
					<div className="columns">
						<div className="column is-narrow">
							<div className="awesome-marker-icon-blue awesome-marker icon legend-marker">
								<i className="fas fa fa-times-circle icon-white" />
							</div>
						</div>
						<div className="column">
							<p><strong>Agahnim needs to be defeated.</strong><br />
								The only condition to making this location available is to defeat Agahnim.
							</p>
						</div>
					</div>
					<div className="columns">
						<div className="column is-narrow">
							<div className="awesome-marker-icon-green awesome-marker icon legend-marker">
								<i className="fas fa fa-skull icon-white" />
							</div>
						</div>
						<div className="column">
							<p><strong>Dungeon.</strong><br />
								Indicates this location is a dungeon where the boss still needs to be defeated.
								Marker color (shown in green) corresponds to non-dungeon marker colors.
							</p>
						</div>
					</div>
					<div className="columns">
						<div className="column is-narrow">
							<div className="awesome-marker-icon-green awesome-marker icon legend-marker">
								<i className="fas fa fa-skull is-dungeon-possible icon-white" />
							</div>
						</div>
						<div className="column">
							<p><strong>Dungeon possible.</strong><br />
								Possible to defeat boss, but you must go through dark rooms.
							</p>
						</div>
					</div>
					<div className="columns">
						<div className="column is-narrow">
							<div className="awesome-marker-icon-pink awesome-marker icon legend-marker">
								<i className="fas fa fa-star icon-white" />
							</div>
						</div>
						<div className="column">
							<p><strong>Favorited.</strong><br />
								This location is marked as a favorite.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default inject('store')(observer(MapHelpModal));
