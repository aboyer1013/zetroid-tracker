import React, { Component, createRef } from 'react';
import { autorun } from 'mobx';
import { observer, inject } from 'mobx-react';
import { debounce, camelCase, pick } from 'lodash';
import '../node_modules/react-resizable/css/styles.css';

const L = window.L;
const Map = class Map extends Component {
	constructor(props) {
		super(props);
		this.resize = debounce(this.resize, 500);
		this.addMarker = this.addMarker.bind(this);
		this.onResizeHandler = this.onResizeHandler.bind(this);
		this.props.layoutNode.setEventListener('resize', function (data) {
			// this.mapContainerRef.current.parentNode.classList.add(`${this.props.mapStore.name}-container`, 'layout-map-container');
			this.onResizeHandler(pick(data.rect, ['width', 'height']));
		}.bind(this));
		this.props.layoutNode.setEventListener('close', function (data) {
			console.log(`${this.props.mapStore.name} visibility:`, data);
			this.resize();
		}.bind(this));
		this.props.layoutNode.setEventListener('visibility', function (data) {
			console.log(`${this.props.mapStore.name} visibility:`, data);
			this.resize();
		}.bind(this));

	}

	markers = {};

	componentDidMount() {
		// I may not need this.
		this.props.mapStore.setComponent(this);
		this.initMap();
		this.initReactions();
	}
	initMap() {
		this.map = L.map(`map-${this.props.id}`, Object.assign({}, {
			crs: L.CRS.Simple,
			center: [-2128,2048],
			zoom: this.props.mapStore.zoom,
			maxBounds: [[0,0], [-4256, 4096]],
			maxBoundsViscosity: 1,
			attributionControl: false,
			zoomControl: false,
		}, this.props.mapOptions));
		this.props.locations.forEach(loc => {
			this.addMarker(loc);
		});
		L.tileLayer(this.props.tileLayerTemplate, Object.assign({}, {
			minZoom: -3,
			maxZoom: 2,
			nativeZooms: [0],
			tileSize: L.point(256, 224),
		}, this.props.tileLayerOptions)).addTo(this.map);
		this.map.setZoom(this.props.mapStore.zoom);

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
		});
	}
	resize() {
		// Why not just call it outright? Because it's flaky and we need a timeout.
		this.map.invalidateSize();
		this.map.fitWorld({maxZoom: -2});
	}
	addMarker(loc) {
		const self = this;
		const theLocation = this.props.mapStore.locations.get(loc.id);
		const markerIcon = L.AwesomeMarkers.icon({
			icon: 'coffee',
			markerColor: 'red',
			prefix: 'fa',
			className: 'awesome-marker icon',
			extraClasses: 'fas'
		});

		this.markers[loc.id] = L
			.marker(loc.coords, { icon: markerIcon })
			.bindTooltip(theLocation.longName)
			.on('click', (event) => {
				const marker = self.markers[loc.id];

				self.props.mapStore.locationDetail.setSelectedLocation(event, marker, theLocation);
			})
			.addTo(this.map)
		;
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
			tooltipAnchor: L.point(20,-25),
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
			markerOptions.icon = icon.DUNGEON;
			if (loc.isDungeonComplete) {
				markerOptions.icon = icon.COMPLETE;
			}
		}
		marker.setIcon(L.AwesomeMarkers.icon(markerOptions));
	}
	onResizeHandler(data) {
		const { width: newWidth, height: newHeight } = data;

		this.props.mapStore.setWidth(newWidth);
		this.props.mapStore.setHeight(newHeight);
		this.resize();
	}
	removeMarker(markerId) {
		this.markers[markerId].off('click');
		this.map.removeLayer(this.markers[markerId]);
		delete this.markers[markerId];
	}
	render() {
		return (
			<div className="map-container">
				<div
					id={`map-${this.props.id}`}
					className="map"
				/>
			</div>
		);
	}
};

export default inject('store')(observer(Map));
