import React, { Component } from 'react';
import { observer, Provider } from 'mobx-react';
import Map from 'Map';
import NavBar from 'NavBar';
import Modal from 'Modal';
import FileImportModal from 'FileImportModal';
import FileExportModal from 'FileExportModal';
import HelpModal from 'HelpModal';
import EditItemListModal from 'EditItemListModal';
import { randomId } from './util';
import { find, get } from 'lodash';
import 'scss/App.scss';
import LocationDetail from 'LocationDetail';
import ItemList from 'ItemList';
import Layout from 'Layout';

class App extends Component {


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
	layoutFactory(node) {
		const component = node.getComponent();
		const config = node.getConfig();

		if (component === 'Map' && get(config, 'mapName')) {
			const map = find([...this.props.store.maps.values()], { name: config.mapName });
			if (map) {
				return (
					<Map
						mapStore={map}
						locations={[...map.locations.values()]}
						id={randomId()}
						tileLayerTemplate={map.tileLayerTemplate}
						layoutNode={node}
					/>
				);
			}
		}
		if (component === 'LocationDetail') {
			return <LocationDetail />;
		}
	}
	render() {
		const store = this.props.store;
		let modal = null;

		if (store.isModalOpen) {
			switch (store.activeModal) {
				case 'FILE_IMPORT':
					modal = <FileImportModal />;
					break;
				case 'FILE_EXPORT':
					modal = <FileExportModal />;
					break;
				case 'HELP':
					modal = <HelpModal />;
					break;
				case 'EDIT_ITEM_LIST':
					modal = <EditItemListModal />;
					break;
				default:
					break;
			}
		}
		return (
			<Provider store={store}>
				<div className="main-container">
					<NavBar />
					<Modal>
						{modal}
					</Modal>
					<Layout factory={this.layoutFactory.bind(this)} />
					{/*<div id="main" className="main">
						{this.generateMaps()}
						<LocationDetail />
						<ItemList
							itemListStore={this.props.store.activeItemList}
							items={this.props.store.activeItemList.sortedItems}
							direction={this.props.store.activeItemList.direction}
							draggableEnabled={false}
						/>
						<ItemList
							itemListStore={this.props.store.activeBossItemList}
							items={this.props.store.activeBossItemList.sortedItems}
							direction={this.props.store.activeBossItemList.direction}
							draggableEnabled={false}
						/>
					</div>*/}

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
