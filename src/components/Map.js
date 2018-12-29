import React, { Component } from 'react';
import { autorun } from 'mobx';
import { observer, inject } from 'mobx-react';
import {
	debounce, camelCase, pick, get, every, filter,
} from 'lodash';
import classNames from 'classnames';

/**
 * Marker color legend:
 * ====================
 * Red: Not available
 * Blue: Can view item
 * Green: Item acquirable
 * Orange: Mix of unavailable and available
 * Yellow: Glitch required or dark room
 *
 * Marker icon legend:
 * ===================
 * "X": Not available
 * "!": Available
 * "✓": Completed
 * "Skull": Boss not defeated
 * "★": Favorited
 */

const { L } = window;
const Map = class Map extends Component {
	markers = {};

	mapBounds = [[0, 0], [-4256, 4096]];

	mapInitialized = false;

	constructor(props) {
		super(props);
		this.resize = debounce(this.resize, 1000);
		this.addMarker = this.addMarker.bind(this);
		this.onResizeHandler = this.onResizeHandler.bind(this);
		this.sizeToFit = this.sizeToFit.bind(this);
		this.props.layoutNode.setEventListener('resize', (data) => {
			this.onResizeHandler(pick(data.rect, ['width', 'height']), !this.mapInitialized);
			this.mapInitialized = true;
		});
		this.props.layoutNode.setEventListener('close', () => {
			this.resize();
		});
		this.props.layoutNode.setEventListener('visibility', () => {
			this.resize();
		});
	}

	componentDidMount() {
		// I may not need this.
		this.props.mapStore.setComponent(this);
		this.initMap();
		this.initReactions();
	}

	onResizeHandler(data, onInit = false) {
		const { width: newWidth, height: newHeight } = data;

		this.props.mapStore.setWidth(newWidth);
		this.props.mapStore.setHeight(newHeight);
		this.resize(onInit);
	}

	setProgression(marker, loc) {
		const markerColor = {
			AGAHNIM_ONLY_REQUIREMENT: 'blue',
			VIEWABLE: 'blue',
			POSSIBLE: 'green',
			UNAVAILABLE: 'red',
			PARTIALLY_AVAILABLE: 'orange',
			AVAILABLE: 'green',
			COMPLETE: 'black',
			FAVORITE: 'pink',
		};
		const icon = {
			VIEWABLE: 'question-circle',
			UNAVAILABLE: 'times-circle',
			AVAILABLE: 'exclamation-circle',
			PARTIALLY_AVAILABLE: 'dot-circle',
			POSSIBLE: 'dot-circle',
			AGAHNIM_ONLY_REQUIREMENT: 'times-circle',
			COMPLETE: 'check-circle',
			FAVORITE: 'star',
			DUNGEON: 'skull',
		};
		const markerOptions = {
			icon: 'times-circle',
			markerColor: 'red',
			prefix: 'fa',
			className: 'awesome-marker icon',
			extraClasses: 'fas',
			tooltipAnchor: L.point(20, -25),
		};

		if (loc.isFavorite) {
			markerOptions.markerColor = markerColor.FAVORITE;
			markerOptions.icon = icon.FAVORITE;
		} else if (loc.isComplete) {
			markerOptions.markerColor = markerColor.COMPLETE;
			markerOptions.icon = icon.COMPLETE;
		} else if (loc.isAvailable) {
			markerOptions.markerColor = markerColor.AVAILABLE;
			markerOptions.icon = icon.AVAILABLE;
		} else if (loc.isPartiallyAvailable) {
			markerOptions.markerColor = markerColor.PARTIALLY_AVAILABLE;
			markerOptions.icon = icon.PARTIALLY_AVAILABLE;
		} else if (loc.isAgahnimTheOnlyRemainingRequirement) {
			markerOptions.markerColor = markerColor.AGAHNIM_ONLY_REQUIREMENT;
			markerOptions.icon = icon.AGAHNIM_ONLY_REQUIREMENT;
		} else if (loc.isViewable) {
			markerOptions.markerColor = markerColor.VIEWABLE;
			markerOptions.icon = icon.VIEWABLE;
		} else if (loc.isPossible) {
			markerOptions.markerColor = markerColor.POSSIBLE;
			markerOptions.icon = icon.POSSIBLE;
		}
		if (loc.isDungeon && !loc.isFavorite) {
			if (loc.isDungeonComplete) {
				markerOptions.markerColor = markerColor.COMPLETE;
				markerOptions.icon = icon.COMPLETE;
			} else if (loc.boss.acquired) {
				markerOptions.icon = icon.AVAILABLE;
			} else {
				markerOptions.icon = icon.DUNGEON;
			}
		}
		marker.setIcon(L.AwesomeMarkers.icon(markerOptions));
	}

	initReactions() {
		const self = this;

		autorun(() => {
			// Add the markers
			self.props.locations.forEach((loc) => {
				if (!self.markers[loc.id]) {
					if (!loc.hidden) {
						self.addMarker(loc);
					}
				}
			});
			// Hide markers marked as hidden or if the location does not exist.
			Object.keys(self.markers).forEach((markerId) => {
				const loc = self.props.mapStore.locations.get(markerId);

				if (loc && loc.hidden) {
					self.removeMarker(markerId);
				} else if (!loc) {
					self.removeMarker(markerId);
				}
			});
			// Set the progression level for each marker (color coded)
			self.props.locations.forEach((loc) => {
				const marker = self.markers[loc.id];

				if (!marker) {
					return;
				}
				self.setProgression(marker, loc);
			});
			if (self.props.mapStore.zoomLock) {
				self.map.touchZoom.disable();
				self.map.doubleClickZoom.disable();
				self.map.scrollWheelZoom.disable();
			} else {
				self.map.touchZoom.enable();
				self.map.doubleClickZoom.enable();
				self.map.scrollWheelZoom.enable();
			}
			this.markerCluster.refreshClusters();
		});
	}

	areAllMarkersAvailable(markers) {
		const locations = markers.map(marker => this.props.mapStore.locations.get(marker.options.locationId));

		return every(locations, loc => loc.currentProgression === loc.PROGRESSION.AVAILABLE);
	}

	areSomeMarkersAvailable(markers) {
		const locations = markers.map(marker => this.props.mapStore.locations.get(marker.options.locationId));
		const filteredLocs = filter(locations, (loc) => {
			return (
				loc.currentProgression === loc.PROGRESSION.AVAILABLE
				|| loc.currentProgression === loc.PROGRESSION.UNAVAILABLE
				|| loc.currentProgression === loc.PROGRESSION.PARTIAL
				|| loc.currentProgression === loc.PROGRESSION.VIEWABLE
			);
		});

		if (every(filteredLocs, loc => loc.currentProgression === loc.PROGRESSION.AVAILABLE)) {
			return false;
		}
		if (every(filteredLocs, loc => loc.currentProgression === loc.PROGRESSION.UNAVAILABLE)) {
			return false;
		}
		return true;
	}

	areAllMarkersUnavailable(markers) {
		const locations = markers.map(marker => this.props.mapStore.locations.get(marker.options.locationId));

		return every(locations, loc => loc.currentProgression === loc.PROGRESSION.UNAVAILABLE);
	}

	resize(sizeToFit = false) {
		// Why not just call it outright? Because it's flakey and we need a timeout.
		this.map.invalidateSize();
		if (sizeToFit) {
			this.sizeToFit();
		}
	}

	markerClickHandler(options) {
		const {
			event,
			marker,
			theLocation,
			ctrlKeyPressed,
			quickMarkMode,
		} = options;

		if (
			(quickMarkMode && !ctrlKeyPressed)
			|| (!quickMarkMode && ctrlKeyPressed)
		) {
			theLocation.toggleComplete();
		}
		this.props.mapStore.locationDetail.setSelectedLocation(event, marker, theLocation);
	}

	addMarker(loc) {
		const self = this;
		const theLocation = this.props.mapStore.locations.get(loc.id);
		const markerIcon = L.AwesomeMarkers.icon({
			markerColor: 'red',
			prefix: 'fa',
			className: 'awesome-marker icon',
			extraClasses: 'fas',
		});

		this.markers[loc.id] = L
			.marker(loc.coords, {
				icon: markerIcon,
				locationId: loc.id,
			})
			.bindTooltip(theLocation.longName)
			.on('click', (event) => {
				const marker = self.markers[loc.id];
				const ctrlKeyPressed = get(event, 'originalEvent.ctrlKey');
				const { quickMarkMode } = self.props.store.config;

				self.markerClickHandler({
					event,
					marker,
					theLocation,
					ctrlKeyPressed,
					quickMarkMode,
				});
			});
		this.markerCluster.addLayer(this.markers[loc.id]);
		this.setProgression(this.markers[loc.id], loc);
	}

	initMap() {
		const self = this;

		this.map = L.map(`map-${this.props.id}`, Object.assign({}, {
			crs: L.CRS.Simple,
			center: [-2128, 2048],
			zoom: this.props.mapStore.zoom,
			maxBounds: this.mapBounds,
			maxBoundsViscosity: 1,
			attributionControl: false,
			zoomControl: false,
			zoomSnap: 0.001,
		}, this.props.mapOptions));
		L.tileLayer(this.props.tileLayerTemplate, Object.assign({}, {
			minZoom: -4,
			maxZoom: 2,
			nativeZooms: [0],
			tileSize: L.point(256, 224),
			bounds: [[0, 0], [-4256, 4096]],
		}, this.props.tileLayerOptions)).addTo(this.map);
		this.map.setZoom(this.props.mapStore.zoom);
		this.markerCluster = L.markerClusterGroup({
			showCoverageOnHover: false,
			zoomToBoundsOnClick: false,
			spiderfyOnMaxZoom: true,
			disableClusteringAtZoom: -2,
			iconCreateFunction: (cluster) => {
				const childMarkers = cluster.getAllChildMarkers();
				const markerClasses = [
					'leaflet-marker-icon',
					'custom-marker-cluster',
					'marker-cluster',
					'marker-cluster-small',
					'leaflet-zoom-animated',
					'leaflet-interactive',
				];
				if (childMarkers.length) {
					if (self.areAllMarkersUnavailable(childMarkers)) {
						markerClasses.push('are-unavailable');
					} else if (self.areAllMarkersAvailable(childMarkers)) {
						markerClasses.push('are-available');
					} else if (self.areSomeMarkersAvailable(childMarkers)) {
						markerClasses.push('are-partially-available');
					}
				}
				const html = `
					<div
						class="${markerClasses.join(' ')}"
						tabIndex="0"
					>
						<div><span>${cluster.getChildCount()}</span></div>
					</div>
				`;
				return L.divIcon({ html });
			},
		});
		this.props.locations.forEach((loc) => {
			this.addMarker(loc);
		});
		Object.keys(this.markers).forEach((key) => {
			this.markerCluster.addLayer(this.markers[key]);
		});
		this.map.addLayer(this.markerCluster);
		// For debugging.
		window[camelCase(this.props.mapStore.name)] = this.map;
	}

	sizeToFit() {
		this.map.setView(this.map.getCenter());
		this.map.fitBounds([[0, 0], [-4256, 4096]]);
	}

	removeMarker(markerId) {
		this.markers[markerId].off('click');
		this.markerCluster.removeLayer(this.markers[markerId]);
		delete this.markers[markerId];
	}

	render() {
		const zoomLockClasses = classNames('fas', {
			'fa-lock': !this.props.mapStore.zoomLock,
			'fa-unlock': this.props.mapStore.zoomLock,
		});
		const zoomLockText = this.props.mapStore.zoomLock ? 'Unlock Zoom' : 'Lock Zoom';
		const hideCompletedClasses = classNames('fas', {
			'fa-eye': this.props.mapStore.hideCompleted,
			'fa-eye-slash': !this.props.mapStore.hideCompleted,
		});
		const hideCompletedText = this.props.mapStore.hideCompleted ? 'Show Completed' : 'Hide Completed';
		const hideUnavailableClasses = classNames('fas', {
			'fa-eye': this.props.mapStore.hideUnavailable,
			'fa-eye-slash': !this.props.mapStore.hideUnavailable,
		});
		const hideUnavailableText = this.props.mapStore.hideUnavailable ? 'Show Unavailable' : 'Hide Unavailable';

		return (
			<div className="map-wrapper">
				<div className="map-toolbar">
					<div className="field has-addons">
						<div className="control">
							<button type="button" className="button is-small" onClick={this.props.mapStore.toggleZoomLock}>
								<span className="icon">
									<i className={zoomLockClasses} />
								</span>
								<span>{zoomLockText}</span>
							</button>
						</div>
						<div className="control">
							<button type="button" className="button is-small" onClick={this.sizeToFit}>
								<span className="icon">
									<i className="fas fa-compress" />
								</span>
								<span>Size to Fit</span>
							</button>
						</div>
						<div className="control">
							<button type="button" className="button is-small" onClick={this.props.mapStore.toggleHideCompleted}>
								<span className="icon">
									<i className={hideCompletedClasses} />
								</span>
								<span>{hideCompletedText}</span>
							</button>
						</div>
						<div className="control">
							<button type="button" className="button is-small" onClick={this.props.mapStore.toggleHideUnavailable}>
								<span className="icon">
									<i className={hideUnavailableClasses} />
								</span>
								<span>{hideUnavailableText}</span>
							</button>
						</div>
					</div>
					<div className="field has-addons">
						<div className="control">
							<button type="button" className="button is-small" onClick={() => this.props.store.openModal('HELP')}>
								<span className="icon">
									<i className="fas fa-question-circle" />
								</span>
							</button>
						</div>
					</div>
				</div>
				<div className="map-container">
					<div
						id={`map-${this.props.id}`}
						className="map"
					/>
				</div>
			</div>
		);
	}
};

export default inject('store')(observer(Map));
