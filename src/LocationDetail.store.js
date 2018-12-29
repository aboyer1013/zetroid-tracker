import { types } from 'mobx-state-tree';
import LocationStore from 'Location.store';

const LocationDetailStore = types
	.model({
		id: types.identifier,
		selectedLocation: types.maybeNull(types.reference(LocationStore)),
	})
	.views(self => ({
		get selectedLocationDetails() {
			return self.selectedLocation.details;
		},
		get progBtnClass() {
			const loc = self.selectedLocation;

			if (!loc) {
				return '';
			}
			switch (loc.currentProgression) {
			case loc.PROGRESSION.COMPLETE:
				return 'is-dark';
			case loc.PROGRESSION.AVAILABLE:
				return 'is-success';
			case loc.PROGRESSION.VIEWABLE:
				return 'is-info';
			case loc.PROGRESSION.PARTIAL:
				return 'is-warning';
			case loc.PROGRESSION.AGAHNIM:
				return 'is-info';
			case loc.PROGRESSION.POSSIBLE:
				return 'is-success';
			default:
				return 'is-danger';
			}
		},
		get progBtnIcon() {
			const loc = self.selectedLocation;

			if (!loc) {
				return '';
			}
			switch (loc.currentProgression) {
			case loc.PROGRESSION.COMPLETE:
				return 'fa-check-circle';
			case loc.PROGRESSION.AVAILABLE:
				return 'fa-exclamation-circle';
			case loc.PROGRESSION.VIEWABLE:
				return 'fa-question-circle';
			case loc.PROGRESSION.PARTIAL:
				return 'fa-dot-circle';
			case loc.PROGRESSION.AGAHNIM:
				return 'fa-times-circle';
			case loc.PROGRESSION.POSSIBLE:
				return 'fa-dot-circle';
			default:
				return 'fa-times-circle';
			}
		},
		get progBtnText() {
			const loc = self.selectedLocation;

			if (!loc) {
				return '';
			}
			switch (loc.currentProgression) {
			case loc.PROGRESSION.COMPLETE:
				return 'Complete';
			case loc.PROGRESSION.AVAILABLE:
				return 'Available';
			case loc.PROGRESSION.VIEWABLE:
				return 'Viewable';
			case loc.PROGRESSION.PARTIAL:
				return 'Partially Available';
			case loc.PROGRESSION.AGAHNIM:
				return 'Agahnim Must Be Defeated';
			case loc.PROGRESSION.POSSIBLE:
				return 'Possible';
			default:
				return 'Unavailable';
			}
		},
	}))
	.actions((self) => {
		const setSelectedLocation = (event, marker, mapStoreLocation) => {
			self.selectedLocation = mapStoreLocation;
		};

		return {
			setSelectedLocation,
		};
	});
export default LocationDetailStore;
