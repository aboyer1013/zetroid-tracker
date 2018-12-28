import { types, getParentOfType } from 'mobx-state-tree';
import ItemStore from 'Item.store';
import AbilitiesStore from 'Abilities.store';
import LocationStore from 'Location.store';
import { isFunction, has } from 'lodash';
import ItemListStore from 'ItemList.store';

const AreaStore = types
	.model({
		id: types.identifier,
		name: types.string,
		longName: types.string,
		collectables: types.array(ItemStore),
		abilities: types.reference(AbilitiesStore),
		// If true, has the potential to be viewable. Different than if the item is CURRENTLY viewable.
		canBeViewable: false,
		itemSelectStore: types.maybeNull(types.reference(ItemListStore)),
		selectedItem: types.maybeNull(types.reference(ItemStore)),
		// TODO This needs to be shareable between multiple stores
		PROGRESSION: types.frozen({
			// All items are acquired.
			COMPLETE: 'COMPLETE',
			// All items are obtainable without glitches.
			AVAILABLE: 'AVAILABLE',
			// The only remaining requirement to obtain all items is to defeat Agahnim.
			// AGAHNIM: 'AGAHNIM',
			// Items can be obtained but include dark rooms (user does not have lantern) to get to chest.
			// There may be more scenarios where this applies.
			POSSIBLE: 'POSSIBLE',
			// Item is not obtainable but can be seen. Useful to check if item is junk or worth skipping.
			VIEWABLE: 'VIEWABLE',
			// All items are not obtainable.
			UNAVAILABLE: 'UNAVAILABLE',
		}),
	})
	.views(self => ({
		isVisible: (item) => {
			return true;
		},
		get colorClass() {
			switch (self.currentProgression) {
				case self.PROGRESSION.COMPLETE:
					return 'is-dark';
				case self.PROGRESSION.AVAILABLE:
					return 'is-success';
				case self.PROGRESSION.VIEWABLE:
					return 'is-info';
				// case self.PROGRESSION.AGAHNIM:
				// 	return 'is-info';
				case self.PROGRESSION.POSSIBLE:
					return 'is-success';
				default:
					return 'is-danger';
			}
		},
		get iconClass() {
			switch (self.currentProgression) {
				case self.PROGRESSION.COMPLETE:
					return 'fa-check-circle';
				case self.PROGRESSION.AVAILABLE:
					return 'fa-exclamation-circle';
				case self.PROGRESSION.VIEWABLE:
					return 'fa-question-circle';
				// case self.PROGRESSION.AGAHNIM:
				// 	return 'fa-times-circle';
				case self.PROGRESSION.POSSIBLE:
					return 'fa-dot-circle';
				default:
					return 'fa-times-circle';
			}
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
			if (has(parent, `possibility[${parent.name}][${self.name}]`)) {
				return parent.possibility[parent.name][self.name]();
			}
			if (has(parent, `possibility[${parent.name}]`) && isFunction(parent, `possibility[${parent.name}]`)) {
				return parent.possibility[parent.name]();
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
			if (self.selectedItem) {
				return false;
			}
			if (has(parent, `viewability[${parent.name}][${self.name}]`)) {
				return parent.viewability[parent.name][self.name]();
			}
			if (isFunction(parent.viewability[parent.name])) {
				return parent.viewability[parent.name]();
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
		},
		get currentProgression() {
			if (self.isDungeonComplete || self.isComplete) {
				return self.PROGRESSION.COMPLETE;
			}
			if (self.isAvailable) {
				return self.PROGRESSION.AVAILABLE;
			}
			// if (self.isAgahnimTheOnlyRemainingRequirement) {
			// 	return self.PROGRESSION.AGAHNIM;
			// }
			if (self.isViewable) {
				return self.PROGRESSION.VIEWABLE;
			}
			if (self.isPossible) {
				return self.PROGRESSION.POSSIBLE;
			}
			return self.PROGRESSION.UNAVAILABLE;
		},
	}))
	.actions(self => {
		const setComplete = () => {
			getParentOfType(self, LocationStore).setComplete();
		};
		const selectItem = (item) => {
			self.selectedItem = item;
		};

		return {
			setComplete,
			selectItem,
		}
	})
;

export default AreaStore;
