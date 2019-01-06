import React, { Component } from 'react';
import { observer, Provider } from 'mobx-react';
import Map from '~/components/Map';
import NavBar from '~/components/NavBar';
import Modal from '~/components/Modal';
import FileImportModal from '~/components/FileImportModal';
import FileExportModal from '~/components/FileExportModal';
import MapHelpModal from '~/components/MapHelpModal';
import EditItemListModal from '~/components/EditItemListModal';
import ItemSelectModal from '~/components/ItemSelectModal';
import ConfigModal from '~/components/ConfigModal';
import { randomId } from '~/utilities/util';
import { find, get } from 'lodash';
import '~/scss/App.scss';
import LocationDetail from '~/components/LocationDetail';
import ItemList from '~/components/ItemList';
import Layout from '~/components/Layout';
import DungeonList from '~/components/DungeonList';
import 'inobounce';

class App extends Component {
	constructor(props) {
		super(props);
		this.layoutFactory = this.layoutFactory.bind(this);
	}

	generateMaps() {
		const maps = [];

		[...this.props.store.maps.values()].forEach((map) => {
			maps.push(
				<Map
					key={`map-${map.id}`}
					mapStore={map}
					locations={[...map.locations.values()]}
					id={randomId()}
					tileLayerTemplate={map.tileLayerTemplate}
				/>,
			);
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
		if (component === 'ItemList') {
			let itemListStore;
			let items;
			let direction;
			let draggableEnabled;

			switch (config.listType) {
				case 'dungeon':
					itemListStore = this.props.store.activeDungeonItemList;
					items = this.props.store.activeDungeonItemList.bosses;
					return (
						<div className="panel-container panel-gray">
							<DungeonList
								itemListStore={itemListStore}
								items={items}
							/>
						</div>
					);
				default:
					itemListStore = this.props.store.activeItemList;
					items = this.props.store.activeItemList.sortedItems;
					direction = this.props.store.activeItemList.direction; // eslint-disable-line prefer-destructuring
					draggableEnabled = false;
					break;
			}
			return (
				<div className="panel-container panel-gray">
					<ItemList
						itemListStore={itemListStore}
						items={items}
						direction={direction}
						draggableEnabled={draggableEnabled}
					/>
				</div>
			);
		}
		return null;
	}

	render() {
		const { store } = this.props;
		let modal = null;

		if (store.isModalOpen) {
			switch (store.activeModal) {
				case 'FILE_IMPORT':
					modal = <FileImportModal />;
					break;
				case 'FILE_EXPORT':
					modal = <FileExportModal />;
					break;
				case 'MAP_HELP':
					modal = <MapHelpModal />;
					break;
				case 'EDIT_ITEM_LIST':
					modal = <EditItemListModal />;
					break;
				case 'CONFIG':
					modal = <ConfigModal />;
					break;
				case 'ITEM_SELECT':
					modal = <ItemSelectModal />;
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
					<Layout layoutStore={store.layout} factory={this.layoutFactory} />
					{/* <Map
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
					/> */}
				</div>
			</Provider>
		);
	}
}

export default observer(App);
