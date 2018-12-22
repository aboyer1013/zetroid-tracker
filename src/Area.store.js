import { types, getParentOfType } from 'mobx-state-tree';
import ItemStore from 'Item.store';
import AbilitiesStore from 'Abilities.store';
import LocationStore from 'Location.store';

const AreaStore = types
	.model({
		id: types.identifier,
		longName: types.string,
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
		},
		get isComplete() {
			let result = true;

			self.collectables.forEach(collectable => {
				if (collectable.qty > 0) {
					result = false;
				}
			});
			return result;
		},
	}))
	.actions(self => {
		const setComplete = () => {
			getParentOfType(self, LocationStore).setComplete();
		};

		return {
			setComplete,
		}
	})
;

export default AreaStore;
