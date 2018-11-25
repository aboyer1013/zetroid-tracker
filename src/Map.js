import React, { Component, createRef } from 'react';
import Draggable from 'gsap/Draggable';
import classNames from 'classnames';
import { debounce } from 'lodash';

const L = window.L;
class Map extends Component {
	constructor() {
		super();
		this.mapRef = createRef();
		this.draggableRef = createRef();
		this.draggableTarget = createRef();
		this.resize = debounce(this.resize, 500);
		this.zoomIn = this.zoomIn.bind(this);
		this.zoomOut = this.zoomOut.bind(this);
		this.toggleSnap = this.toggleSnap.bind(this);
		this.toggleWindowLock = this.toggleWindowLock.bind(this);
		this.resetToCenter = this.resetToCenter.bind(this);
		this.onChangeWidth = this.onChangeWidth.bind(this);
		this.onChangeHeight = this.onChangeHeight.bind(this);
	}

	offsetWidth = 53;
	offsetHeight = 108;
	state = {
		toggleSnap: false,
		toggleWindowLock: false,
		containerWidth: 565,
		containerHeight: 640,
		mapWidth: 512,
		mapHeight: 532,
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		// console.log(prevProps, prevState, snapshot);
		
	}
	componentDidMount() {
		const self = this;

		this.map = L.map(`map-${this.props.id}`, Object.assign({}, {
			crs: L.CRS.Simple,
			center: [-2128,2048],
			zoom: -3,
			maxBounds: [[0,0], [-4256, 4096]],
			maxBoundsViscosity: 1,
			attributionControl: false,
			zoomControl: false,
		}, this.props.mapOptions));
		// window.map = this.map;
		L.tileLayer(this.props.tileLayerTemplate, Object.assign({}, {
			minZoom: -3,
			maxZoom: 2,
			nativeZooms: [0],
			// errorTileUrl: `${process.env.PUBLIC_URL}/img/maps/notfound.gif`,
			tileSize: L.point(256, 224),
		}, this.props.tileLayerOptions)).addTo(this.map);
		// L.marker([-2825,2240]).bindTooltip('Magic mirror required').addTo(this.map);
		// L.popup().setLatLng([-1256, 1256]).setContent('<h1>Ohai</h1> <p> This is an example popup.</p>').openOn(this.map);

		this.map.setZoom(-3);
		this.resize();
		this.draggable = new Draggable(this.draggableRef.current, {
			trigger: this.draggableTarget.current,
			bounds: document.querySelector('body'),
			liveSnap: (value) => self.state.toggleSnap ? Math.round(value / 50) * 50 : value,
		});
	}

	resize() {
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
		this.setState({ toggleWindowLock: !this.state.toggleWindowLock });
		this.draggable.enabled(this.state.toggleWindowLock);
	}
	resetToCenter() {
		this.map.setView([0,0], -3);
	}
	onChangeHeight(evt) {
		this.setState({
			containerHeight: evt.target.value,
			mapHeight: evt.target.value - this.offsetHeight,
		});
		this.resize();
	}
	onChangeWidth(evt) {
		this.setState({
			containerWidth: evt.target.value,
			mapWidth: evt.target.value - this.offsetWidth,
		});
		this.resize();
	}
	render() {
		// const snapClasses = classNames('button', {
		// 	'is-selected': this.state.toggleSnap,
		// 	'is-success': this.state.toggleSnap,
		// });
		const lockClasses = classNames('fas', {
			'fa-lock-open': !this.state.toggleWindowLock,
			'fa-lock': this.state.toggleWindowLock
		})

		return (
			<div
				style={{
					width: this.state.containerWidth + 'px',
					height: this.state.containerHeight + 'px'
				}}
				className="message is-primary map-container has-background-grey-darker is-unselectable"
				ref={this.draggableRef}
			>
				<header className="message-header" ref={this.draggableTarget}>
					<div className="buttons has-addons is-marginless">
						<button onClick={this.zoomOut} className="button"><span className="icon"><i className="fas fa-search-minus" /></span></button>
						<button onClick={this.zoomIn} className="button"><span className="icon"><i className="fas fa-search-plus" /></span></button>
						<button title="Reset zoom and center" onClick={this.resetToCenter} className="button"><span className="icon"><i className="fas fa-compress" /></span></button>
						{/*<button onClick={this.toggleSnap} className={snapClasses}><span className="icon"><i className="fas fa-th" /></span></button>*/}
						<div className="size-controls">
							<div>
								<label htmlFor="width">Width </label>
								<input type="range" id="width" min="565" max="2000" step={20} onChange={this.onChangeWidth} />
							</div>
							<div>
								<label htmlFor="height">Height </label>
								<input type="range" id="height" min="640" max="2000" step={20} onChange={this.onChangeHeight} />
							</div>
						</div>
					</div>
					<div className="buttons has-addons is-marginless">
						<button onClick={this.toggleWindowLock} className="button"><span className="icon"><i className={lockClasses} /></span></button>
					</div>
				</header>
				<div className="message-body map-body">
					<div id={`map-${this.props.id}`} ref={this.mapRef} className="map" />
					{/*<div className="content"></div>*/}
				</div>
			</div>
		);
	}
}

export default Map;
