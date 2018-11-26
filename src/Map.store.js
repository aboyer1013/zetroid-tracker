import { types } from 'mobx-state-tree';
import GameStore from 'Game.store';
import LocationStore from 'Location.store';

const MapStore = types
	.model({
		id: types.identifier,
		name: types.string,
		longName: types.string,
		game: types.reference(GameStore),
		locations: types.map(LocationStore),
		selectedLocation: types.maybe(types.reference(LocationStore)),
		displayHelp: true,
		isVisible: true,
		tileLayerTemplate: types.string,
		offset: 0,
		x: 0,
		y: 0,
	})
	.volatile(() => ({
		component: {},
	}))
	.views((self) => ({
		get selectedLocationDetails() {
			return self.selectedLocation.details;
		}
	}))
	.actions((self) => {
		const setComponent = (component) => {
			self.component = component;
		};
		const setSelectedLocation = (event, marker, mapStoreLocation) => {
			self.selectedLocation = mapStoreLocation;
			self.displayHelp = false;
		}
		const showHelp = () => {
			self.displayHelp = true;
		}
		const setMapVisibility = (isVisible) => {
			self.isVisible = isVisible;
		}
		const setPos = (newPos) => {
			self.x = newPos.x;
			self.y = newPos.y;
		}

		return {
			setComponent,
			setSelectedLocation,
			showHelp,
			setMapVisibility,
			setPos,
		};
	})
;

export default MapStore;
