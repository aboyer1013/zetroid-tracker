import { types, getRoot } from 'mobx-state-tree';
import GameStore from 'Game.store';

const LocationStore = types
	.model({
		id: types.identifier,
		name: types.string,
		longName: types.string,
		image: '',
		game: types.reference(GameStore),
		coords: types.array(types.integer),
		itemRequirements: types.array(types.string),
		markerType: types.optional(types.enumeration('Marker Type', ['UNAVAILABLE', 'AVAILABLE', 'COMPLETE', 'HIGHLIGHT']), 'UNAVAILABLE'),
	})
	.views((self) => ({
		get details() {
			let itemRequirements;

			if (self.itemRequirements) {
				itemRequirements = self.itemRequirements.map(req => getRoot(self).getItemByName(req))
			}

			return {
				longName: self.longName,
				itemRequirements,
			};
		},
		get defaultMarkerType() {
			return 'UNAVAILABLE';
		},
		get tooltipContent() {
			return self.longName;
		},
	}))
	.actions((self) => {
		const setMarkerType = (type) => {
			self.markerType = type;
		};

		return {
			setMarkerType,
		};
	})
;

export default LocationStore;
