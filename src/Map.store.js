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
		x: types.optional(types.maybeNull(types.integer), null),
		y: types.optional(types.maybeNull(types.integer), null),
		containerWidth: types.optional(types.maybeNull(types.integer), null),
		containerHeight: types.optional(types.maybeNull(types.integer), null),
		isLocked: false,
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
		const setWidth = (newWidth) => {
			self.containerWidth = newWidth;
		}
		const setHeight = (newHeight) => {
			self.containerHeight = newHeight;
		}
		const setLocked = (isLocked) => {
			self.isLocked = isLocked;
		};

		return {
			setComponent,
			setSelectedLocation,
			showHelp,
			setMapVisibility,
			setPos,
			setWidth,
			setHeight,
			setLocked,
		};
	})
;

export default MapStore;
