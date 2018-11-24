import React, { Component, createRef } from 'react';
// import TweenMax from 'gsap/TweenMax';
// import Draggable from 'gsap/Draggable';
// import L from 'leaflet';
import 'scss/App.scss';

const L = window.L;
class App extends Component {
	constructor() {
		super();
		this.mapRef = createRef();
		this.resize = this.resize.bind(this);
	}

	componentDidMount() {
		this.map = L.map('map-container', {
			crs: L.CRS.Simple,
			center: [-2128,2048],
			zoom: -3,
			maxBounds: [[0,0], [-4256, 4096]],
			maxBoundsViscosity: 1,
		});
		window.map = this.map;
		L.tileLayer(`${process.env.PUBLIC_URL}/img/maps/zelda3/lw/{z}/zelda3-lw.{x}.{y}.png`, {
			minZoom: -3,
			maxZoom: 2,
			nativeZooms: [0],
			// errorTileUrl: `${process.env.PUBLIC_URL}/img/maps/notfound.gif`,
			tileSize: L.point(256, 224),
		}).addTo(this.map);
		L.marker([-2825,2240]).bindTooltip('Magic mirror required').addTo(this.map);
		this.map.setZoom(-3);
		this.resize();
	}

	resize() {
		this.mapRef.current.style.width = '512px';
		this.mapRef.current.style.height = '532px';
		this.map.invalidateSize();
	}
	render() {
		return (
			<div>
				<button onClick={this.resize}>Resize</button>
				<div id="map-container" ref={this.mapRef} />
			</div>
		);
	}
}

export default App;
