import { types } from 'mobx-state-tree';
import GameStore from 'Game.store';
import LocationStore from 'Location.store';
import LocationDetailStore from 'LocationDetail.store';

const MapStore = types
	.model({
		id: types.identifier,
		name: types.string,
		longName: types.string,
		game: types.reference(GameStore),
		locations: types.map(LocationStore),
		selectedLocation: types.maybe(types.reference(LocationStore)),
		locationDetail: types.reference(LocationDetailStore),
		isVisible: true,
		tileLayerTemplate: types.string,
		offset: 0,
		x: types.optional(types.maybeNull(types.number), null),
		y: types.optional(types.maybeNull(types.number), null),
		containerWidth: types.optional(types.maybeNull(types.number), null),
		containerHeight: types.optional(types.maybeNull(types.number), null),
		isLocked: false,
		zoom: -3,
	})
	.volatile(() => ({
		component: {},
	}))
	.views((self) => ({
		get selectedLocationDetails() {
			return self.selectedLocation.details;
		},
	}))
	.actions((self) => {
		const setComponent = (component) => {
			self.component = component;
		};
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
		const setSelectedLocation = (event, marker, mapStoreLocation) => {
			self.selectedLocation = mapStoreLocation;
		};
		const setZoom = (newZoom) => {
			self.zoom = newZoom;
		}

		return {
			setComponent,
			setSelectedLocation,
			showHelp,
			setMapVisibility,
			setPos,
			setWidth,
			setHeight,
			setLocked,
			setZoom,
		};
	})
;

export default MapStore;
