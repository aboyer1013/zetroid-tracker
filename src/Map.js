import React, { Component, createRef } from 'react';
import { autorun } from 'mobx';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';
import { debounce, camelCase, isNull, pick } from 'lodash';
import '../node_modules/react-resizable/css/styles.css';

const L = window.L;
const Map = class Map extends Component {
	constructor(props) {
		super(props);
		this.mapRef = createRef();
		this.draggableRef = createRef();
		this.draggableTarget = createRef();
		// Throttle the expensive map resizing for spaz busting.
		this.resize = debounce(this.resize, 500);
		this.zoomIn = this.zoomIn.bind(this);
		this.zoomOut = this.zoomOut.bind(this);
		this.toggleWindowLock = this.toggleWindowLock.bind(this);
		this.resetToCenter = this.resetToCenter.bind(this);
		this.addMarker = this.addMarker.bind(this);
		this.onResizeHandler = this.onResizeHandler.bind(this);
		this.props.layoutNode.setEventListener('resize', function (data) {
			this.onResizeHandler(null, {size: pick(data.rect, ['width', 'height'])});
		}.bind(this));
	}

	markers = {};
	offsetWidth = 0;
	offsetHeight = 0;
	fitWidth = 590;
	fitHeight = 680;
	// TODO take this out of state
	state = {
		containerWidth: 590,
		containerHeight: 680,
		mapWidth: 537,
		mapHeight: 572,
	};

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
		this.map.on('zoomend', () => this.map.setZoom(this.map.getZoom()));
		// For debugging.
		window[camelCase(this.props.mapStore.name)] = this.map;
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
		this.resize();
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
		if (!isNull(this.props.mapStore.containerWidth)) {
			this.setState({
				containerWidth: this.props.mapStore.containerWidth,
				containerHeight: this.props.mapStore.containerHeight,
				mapWidth: this.props.mapStore.containerWidth - this.offsetWidth,
				mapHeight: this.props.mapStore.containerHeight - this.offsetHeight,
			});
		}
		this.mapRef.current.style.width = this.state.mapWidth + 'px';
		this.mapRef.current.style.height = this.state.mapHeight + 'px';
		this.map.invalidateSize();
	}
	zoomIn() {
		this.map.zoomIn();
	}
	zoomOut() {
		this.map.zoomOut();
	}
	toggleSnap() {
		this.setState({ toggleSnap: !this.state.toggleSnap });
	}
	toggleWindowLock() {
		this.props.mapStore.setLocked(!this.props.mapStore.isLocked);
	}
	resetToCenter() {
		this.map.setView([0,0], -3);
		this.onResizeHandler(null, {
			size: {
				width: this.fitWidth,
				height: this.fitHeight,
			},
		});
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
	onResizeHandler(event, data) {
		const { width: newWidth, height: newHeight } = data.size;

		this.setState({
			containerWidth: newWidth,
			mapWidth: newWidth - this.offsetWidth,
			containerHeight: newHeight,
			mapHeight: newHeight - this.offsetHeight,
		});
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
		const lockClasses = classNames('fas', {
			'fa-lock-open': !this.props.mapStore.isLocked,
			'fa-lock': this.props.mapStore.isLocked
		});
		const containerClasses = classNames('message-container', {'is-off-screen': !this.props.mapStore.isVisible})

		return <div id={`map-${this.props.id}`} ref={this.mapRef} className="map" />;
		return (
				<div className={containerClasses}>
						<div
							className="message is-primary map-container has-background-grey-darker is-unselectable"
						>
							<header className="message-header" ref={this.draggableTarget}>
								<div className="buttons has-addons is-marginless">
									<button onClick={this.zoomOut} className="button">
										<span className="icon"><i className="fas fa-search-minus" /></span>
									</button>
									<button onClick={this.zoomIn} className="button">
										<span className="icon"><i className="fas fa-search-plus" /></span>
									</button>
								</div>
								<div className="buttons has-addons is-marginless">
									<button title="Reset zoom and center" onClick={this.resetToCenter} className="button">
										<span className="icon"><i className="fas fa-compress" /></span>
									</button>
									<button onClick={this.toggleWindowLock} className="button"><span className="icon"><i className={lockClasses} /></span></button>
								</div>
							</header>
							<div className="message-body map-body">
								<div id={`map-${this.props.id}`} ref={this.mapRef} className="map" />
							</div>
						</div>
				</div>
		);
	}
};

export default inject('store')(observer(Map));
