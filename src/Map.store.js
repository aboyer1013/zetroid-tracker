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
		tileLayerTemplate: types.string,
		offset: 0,
		containerWidth: types.optional(types.number, 0),
		containerHeight: types.optional(types.number, 0),
		isLocked: false,
		zoom: -3,
		zoomLock: false,
		hideCompleted: false,
	})
	.volatile(() => ({
		component: {},
	}))
	.views((self) => ({
		get selectedLocationDetails() {
			return self.selectedLocation.details;
		},
		get dungeonLocations() {
			return [...self.locations.values()].filter(loc => loc.isDungeon);
		}
	}))
	.actions((self) => {
		const setComponent = (component) => {
			self.component = component;
		};
		const setWidth = (newWidth) => {
			self.containerWidth = newWidth;
		}
		const setHeight = (newHeight) => {
			self.containerHeight = newHeight;
		}
		const setSelectedLocation = (marker, mapStoreLocation) => {
			self.selectedLocation = mapStoreLocation;
		};
		const setZoom = (newZoom) => {
			self.zoom = newZoom;
		};
		const toggleZoomLock = () => {
			self.zoomLock = !self.zoomLock;
		};
		const toggleHideCompleted = () => {
			self.hideCompleted = !self.hideCompleted;
		};

		return {
			setComponent,
			setSelectedLocation,
			setWidth,
			setHeight,
			setZoom,
			toggleZoomLock,
			toggleHideCompleted,
		};
	})
;

export default MapStore;
