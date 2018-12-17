import React, {Component} from 'react';
import {autorun} from 'mobx';
import {observer, inject} from 'mobx-react';
import {debounce, camelCase, pick, get} from 'lodash';
import classNames from 'classnames';

const L = window.L;
const Map = class Map extends Component {
	constructor(props) {
		super(props);
		this.resize = debounce(this.resize, 1000);
		this.addMarker = this.addMarker.bind(this);
		this.onResizeHandler = this.onResizeHandler.bind(this);
		this.sizeToFit = this.sizeToFit.bind(this);
		this.props.layoutNode.setEventListener('resize', function (data) {
			this.onResizeHandler(pick(data.rect, ['width', 'height']), !this.mapInitialized);
			this.mapInitialized = true;
		}.bind(this));
		this.props.layoutNode.setEventListener('close', function (data) {
			this.resize();
		}.bind(this));
		this.props.layoutNode.setEventListener('visibility', function (data) {
			this.resize();
		}.bind(this));

	}

	markers = {};
	mapBounds = [[0, 0], [-4256, 4096]];
	mapInitialized = false;

	componentDidMount() {
		// I may not need this.
		this.props.mapStore.setComponent(this);
		this.initMap();
		this.initReactions();
	}

	initMap() {
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
		});
		this.props.locations.forEach(loc => {
			this.addMarker(loc);
		});
		Object.keys(this.markers).forEach(function (key) {
			this.markerCluster.addLayer(this.markers[key]);
		}.bind(this));
		this.map.addLayer(this.markerCluster);
		// For debugging.
		window[camelCase(this.props.mapStore.name)] = this.map;
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
				self.setProgression(self.markers[loc.id], loc);
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
		});
	}

	resize(sizeToFit = false) {
		// Why not just call it outright? Because it's flaky and we need a timeout.
		this.map.invalidateSize();
		sizeToFit && this.sizeToFit();
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
			(quickMarkMode && !ctrlKeyPressed) ||
			(!quickMarkMode && ctrlKeyPressed)
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
			extraClasses: 'fas'
		});

		this.markers[loc.id] = L
			.marker(loc.coords, {icon: markerIcon})
			.bindTooltip(theLocation.longName)
			.on('click', (event) => {
				const marker = self.markers[loc.id];
				const ctrlKeyPressed = get(event, 'originalEvent.ctrlKey');
				const quickMarkMode = self.props.store.config.quickMarkMode;

				self.markerClickHandler({
					event,
					marker,
					theLocation,
					ctrlKeyPressed,
					quickMarkMode,
				});
			})
		;
		this.markerCluster.addLayer(this.markers[loc.id]);
		this.setProgression(this.markers[loc.id], loc);
	}

	setProgression(marker, loc) {
		const markerColor = {
			VIEWABLE: 'blue',
			UNAVAILABLE: 'red',
			AVAILABLE: 'green',
			COMPLETE: 'black',
			FAVORITE: 'orange',
		};
		const icon = {
			VIEWABLE: 'question-circle',
			UNAVAILABLE: 'times-circle',
			AVAILABLE: 'exclamation-circle',
			COMPLETE: 'check-circle',
			FAVORITE: 'star',
			DUNGEON: 'skull'
		}
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
		} else if (loc.isViewable) {
			markerOptions.markerColor = markerColor.VIEWABLE;
			markerOptions.icon = icon.VIEWABLE;
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

	onResizeHandler(data, onInit = false) {
		const {width: newWidth, height: newHeight} = data;

		this.props.mapStore.setWidth(newWidth);
		this.props.mapStore.setHeight(newHeight);
		this.resize(onInit);
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

		return (
			<div className="map-wrapper">
				<div className="map-toolbar">
					<div className="field has-addons">
						<div className="control">
							<button className="button is-small" onClick={this.props.mapStore.toggleZoomLock}>
								<span className="icon">
									<i className={zoomLockClasses} />
								</span>
								<span>{zoomLockText}</span>
							</button>
						</div>
						<div className="control">
							<button className="button is-small" onClick={this.sizeToFit}>
								<span className="icon">
									<i className="fas fa-compress" />
								</span>
								<span>Size to Fit</span>
							</button>
						</div>
						<div className="control">
							<button className="button is-small" onClick={this.props.mapStore.toggleHideCompleted}>
								<span className="icon">
									<i className={hideCompletedClasses} />
								</span>
								<span>{hideCompletedText}</span>
							</button>
						</div>
					</div>
					<div className="field has-addons">
						<div className="control">
							<button className="button is-small" onClick={() => this.props.store.openModal('HELP')}>
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
