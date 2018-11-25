import { types } from 'mobx-state-tree';
import Game from 'Game.store';
import Location from 'Location.store';

const MapStore = types
	.model({
		id: types.identifier,
		name: types.string,
		game: types.reference(Game),
		locations: types.map(Location),
	})
	.volatile(() => ({
		component: {},
	}))
	.actions((self) => {
		const setComponent = (component) => {
			self.component = component;
		};

		return {
			setComponent,
		};
	})
;

export default MapStore;
