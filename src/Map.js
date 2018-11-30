import React, { Component, createRef } from 'react';
import { autorun } from 'mobx';
import { observer, inject } from 'mobx-react';
import Draggable from 'gsap/Draggable';
import TweenLite from 'gsap/TweenLite';
import classNames from 'classnames';
import { debounce, camelCase, isNull } from 'lodash';
import { ResizableBox } from 'react-resizable';
import '../node_modules/react-resizable/css/styles.css';

const L = window.L;
const Map = class Map extends Component {
	constructor() {
		super();
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
	}

	markers = {};
	offsetWidth = 53;
	offsetHeight = 108;
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
		this.initDraggable();
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
		this.resize();
	}
	initDraggable() {
		this.draggable = new Draggable(this.draggableRef.current, {
			trigger: this.draggableTarget.current,
			bounds: document.querySelector('#main'),
			// No subpixel dragging.
			liveSnap: (value) => Math.round(value / 1),
			onDragEnd: () => {
				this.props.mapStore.setPos({ x: this.draggable.endX, y: this.draggable.endY, });
			}
		});
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
			self.draggable.enabled(!self.props.mapStore.isLocked);
			// Sync GSAP Draggable x/y with the map store.
			TweenLite.set(self.draggableRef.current, {x: self.props.mapStore.x, y: self.props.mapStore.y });
			if (isNull(self.props.mapStore.x)) {
				TweenLite.set(self.draggableRef.current, self.initPosition);
			}
			self.map.setZoom(self.props.mapStore.zoom);
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
	get initPosition() {
		const windowRect = document.querySelector('body').getBoundingClientRect();
		const width = this.state.containerWidth;
		const x = (windowRect.width / 2) - (width / 2) + this.props.mapStore.offset;
		const y = this.props.mapStore.offset + 50;

		this.props.mapStore.setPos({ x, y });
		return { x, y };
	}
	zoomIn() {
		const mapStore = this.props.mapStore;
		const newZoom = mapStore.zoom + 1;

		if (newZoom > 2) {
			return;
		}
		mapStore.setZoom(newZoom);
	}
	zoomOut() {
		const mapStore = this.props.mapStore;
		const newZoom = mapStore.zoom - 1;

		if (newZoom < -3) {
			return;
		}
		mapStore.setZoom(newZoom);
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

		return (
			<div ref={this.draggableRef} className={containerClasses}>
				<ResizableBox
					width={this.state.containerWidth}
					height={this.state.containerHeight}
					minConstraints={[256, 256]}
					onResizeStop={this.onResizeHandler}
				>
					<div
						style={{
							width: '100%',
							height: '100%',
						}}
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
				</ResizableBox>
			</div>
		);
	}
};

export default inject('store')(observer(Map));
