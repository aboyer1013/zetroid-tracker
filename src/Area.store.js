import { types, getParentOfType } from 'mobx-state-tree';
import ItemStore from 'Item.store';
import AbilitiesStore from 'Abilities.store';
import LocationStore from 'Location.store';

const AreaStore = types
	.model({
		id: types.identifier,
		longName: types.string,
		isComplete: false,
		collectables: types.array(ItemStore),
		abilities: types.reference(AbilitiesStore),
	})
	.views(self => ({
		isVisible: (item) => {
			return true;
		},
		get acquired() {
			const parent = getParentOfType(self, LocationStore);

			return parent.isAvailable || parent.isComplete;
		}
	}))
	// .actions(self => {
	// 	const activateCollectables = () => {
	// 		if (getParent(self).isAvailable) {
	// 			self.collectables.forEach(collectable => collectable.acquire(true));
	// 		}
	// 	};
	//
	// 	return {
	// 		activateCollectables,
	// 	}
	// })
;

export default AreaStore;
