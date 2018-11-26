import React, { Component } from 'react';
import { observer, Provider } from 'mobx-react';
import Map from 'Map';
import NavBar from 'NavBar';
import { randomId } from './util';
import 'scss/App.scss';

class App extends Component {
	// constructor() {
	// 	super();
	// }

	componentDidMount() {
	}

	generateMaps() {
		const maps = [];

		[...this.props.store.maps.values()].forEach(map => {
			maps.push(
				<Map
					key={`map-${map.id}`}
					mapStore={map}
					locations={[...map.locations.values()]}
					id={randomId()}
					tileLayerTemplate={map.tileLayerTemplate}
				/>
			)
		});
		return maps;
	}
	render() {
		return (
			<Provider store={this.props.store}>
				<div>
					{/*{[...this.props.store.items.values()].map(item => <img src={item.image} />)}*/}
					<NavBar />
					{this.generateMaps()}
					{/*<Map
						mapStore={this.props.store.getMapByName('zelda3-dw')}
						id={randomId()}
						tileLayerTemplate={`${process.env.PUBLIC_URL}/img/maps/zelda3/dw/{z}/zelda3-dw.{x}.{y}.png`}
					/>*/}
					{/*<Map
						id={randomId()}
						mapOptions={{
							center: [-560,640],
							zoom: 0,
							maxBounds: [[0,0], [-1120, 1280]],
						}}
						tileLayerTemplate={`${process.env.PUBLIC_URL}/img/maps/metroid3/zebes/{z}/metroid3-zebes.{x}.{y}.png`}
						tileLayerOptions={{
							minZoom: -1,
							maxZoom: 2,
						}}
						mapWidth={1280}
						mapHeight={1120}
					/>*/}
				</div>
			</Provider>
		);
	}
}

export default observer(App);
