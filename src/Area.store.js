import { types, getParentOfType } from 'mobx-state-tree';
import ItemStore from 'Item.store';
import AbilitiesStore from 'Abilities.store';
import LocationStore from 'Location.store';
import { isFunction } from 'lodash';

const AreaStore = types
	.model({
		id: types.identifier,
		name: types.string,
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

			if (!parent) {
				return false;
			}
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
		get isAvailable() {
			const parent = getParentOfType(self, LocationStore);

			if (!parent) {
				return false;
			}
			if (!parent.availability[parent.name]) {
				return false;
			}
			if (isFunction(parent.availability[parent.name])) {
				return parent.availability[parent.name]();
			}
			if (isFunction(parent.availability[parent.name][self.name])) {
				return parent.availability[parent.name][self.name]();
			}
		},
		get isPossible() {
			const parent = getParentOfType(self, LocationStore);

			if (!parent) {
				return false;
			}
			if (!parent.possibility[parent.name]) {
				return false;
			}
			if (isFunction(parent.possibility[parent.name])) {
				return parent.possibility[parent.name]();
			}
			if (isFunction(parent.possibility[parent.name][self.name])) {
				return parent.possibility[parent.name][self.name]();
			}
		},
		get isViewable() {
			const parent = getParentOfType(self, LocationStore);

			if (!parent) {
				return false;
			}
			if (!parent.viewability[parent.name]) {
				return false;
			}
			if (isFunction(parent.viewability[parent.name])) {
				return parent.viewability[parent.name]();
			}
			if (isFunction(parent.viewability[parent.name][self.name])) {
				return parent.viewability[parent.name][self.name]();
			}
		},
		get mustDefeatAgahnimFirst() {
			const parent = getParentOfType(self, LocationStore);

			if (!parent) {
				return false;
			}
			if (!parent.mustDefeatAgahnimFirst[parent.name]) {
				return false;
			}
			if (isFunction(parent.mustDefeatAgahnimFirst[parent.name])) {
				return parent.mustDefeatAgahnimFirst[parent.name]();
			}
			if (isFunction(parent.mustDefeatAgahnimFirst[parent.name][self.name])) {
				return parent.mustDefeatAgahnimFirst[parent.name][self.name]();
			}
		}
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
