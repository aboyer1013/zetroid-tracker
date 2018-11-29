import { types } from 'mobx-state-tree';
import LocationStore from 'Location.store';

const LocationDetailStore = types
	.model({
		id: types.identifier,
		selectedLocation: types.maybeNull(types.reference(LocationStore)),
		isVisible: true,
	})
	.views((self) => ({
		get selectedLocationDetails() {
			return self.selectedLocation.details;
		},
	}))
	.actions((self) => {
		const setSelectedLocation = (event, marker, mapStoreLocation) => {
			self.selectedLocation = mapStoreLocation;
		};
		const setVisibility = (isVisible) => {
			self.isVisible = isVisible;
		};

		return {
			setSelectedLocation,
			setVisibility,
		};
	})
;

export default LocationDetailStore;
