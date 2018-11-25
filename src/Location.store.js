import { types, getRoot } from 'mobx-state-tree';
import Game from 'Game.store';

const Location = types
	.model({
		id: types.identifier,
		name: types.string,
		longName: types.string,
		image: '',
		game: types.reference(Game),
		coords: types.array(types.integer),
		itemRequirements: types.array(types.string),
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
		}
	}))
;

export default Location;
