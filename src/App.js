import React, { Component } from 'react';
import { observer, Provider } from 'mobx-react';
import Map from 'Map';
import NavBar from 'NavBar';
import Modal from 'Modal';
import FileImportModal from 'FileImportModal';
import FileExportModal from 'FileExportModal';
import { randomId } from './util';
import 'scss/App.scss';
import LocationDetail from 'LocationDetail';
import ItemList from 'ItemList';

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
		const store = this.props.store;
		let modal = null;
		const items = store.itemList.items;

		if (store.isModalOpen) {
			switch (store.activeModal) {
				case 'FILE_IMPORT':
					modal = <FileImportModal/>;
					break;
				case 'FILE_EXPORT':
					modal = <FileExportModal/>;
					break;
				default:
					break;
			}
		}
		return (
			<Provider store={store}>
				<div className="main-container">
					<NavBar />
					<div id="main" className="main">
						{this.generateMaps()}
						<LocationDetail />
						<ItemList items={this.props.store.itemList.sortedItems} />
					</div>
					<Modal>
						{modal}
					</Modal>
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
