import React, { Component, createRef } from 'react';
import Draggable from 'gsap/Draggable';

const L = window.L;
class Map extends Component {
	constructor() {
		super();
		this.mapRef = createRef();
		this.draggableRef = createRef();
		this.draggableTarget = createRef();
		this.resize = this.resize.bind(this);
		this.zoomIn = this.zoomIn.bind(this);
		this.zoomOut = this.zoomOut.bind(this);
	}

	componentDidMount() {
		this.map = L.map(`map-${this.props.id}`, {
			crs: L.CRS.Simple,
			center: [-2128,2048],
			zoom: -3,
			maxBounds: [[0,0], [-4256, 4096]],
			maxBoundsViscosity: 1,
			attributionControl: false,
			zoomControl: false,
		});
		window.map = this.map;
		L.tileLayer(`${process.env.PUBLIC_URL}/img/maps/zelda3/lw/{z}/zelda3-lw.{x}.{y}.png`, {
			minZoom: -3,
			maxZoom: 2,
			nativeZooms: [0],
			// errorTileUrl: `${process.env.PUBLIC_URL}/img/maps/notfound.gif`,
			tileSize: L.point(256, 224),
		}).addTo(this.map);
		// L.marker([-2825,2240]).bindTooltip('Magic mirror required').addTo(this.map);
		// L.popup().setLatLng([-1256, 1256]).setContent('<h1>Ohai</h1> <p> This is an example popup.</p>').openOn(this.map);

		this.map.setZoom(-3);
		this.resize();
		this.draggable = new Draggable(this.draggableRef.current, {
			trigger: this.draggableTarget.current,
		});
	}

	resize() {
		this.mapRef.current.style.width = '512px';
		this.mapRef.current.style.height = '532px';
		this.map.invalidateSize();
	}

	zoomIn() {
		this.map.zoomIn();
	}
	zoomOut() {
		this.map.zoomOut();
	}
	render() {
		return (
			<div className="message is-primary map-container has-background-grey-darker" ref={this.draggableRef}>
				<header className="message-header" ref={this.draggableTarget}>
					<div className="buttons">
						<button onClick={this.zoomIn} className="button"><span className="icon"><i className="fas fa-search-plus" /></span></button>
						<button onClick={this.zoomOut} className="button"><span className="icon"><i className="fas fa-search-minus" /></span></button>
					</div>
				</header>
				<div className="message-body">
					<div id={`map-${this.props.id}`} ref={this.mapRef} className="map" />
					{/*<div className="content"></div>*/}
				</div>
			</div>
		);
	}
}

export default Map;
