import { types, getParentOfType } from 'mobx-state-tree';
import ItemStore from '~/Item.store';
import AbilitiesStore from '~/Abilities.store';
import LocationStore from '~/Location.store';
import { isFunction, has, includes } from 'lodash';
import ItemListStore from '~/ItemList.store';

const AreaStore = types
	.model({
		id: types.identifier,
		name: types.string,
		longName: types.string,
		chests: types.array(ItemStore),
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
			// Some items, but not all, are obtainable without glitches.
			PARTIAL: 'PARTIAL',
			// The only remaining requirement to obtain all items is to defeat Agahnim.
			AGAHNIM: 'AGAHNIM',
			// Items can be obtained but include dark rooms (user does not have lantern) to get to chest.
			// There may be more scenarios where this applies.
			POSSIBLE: 'POSSIBLE',
			// Item is not obtainable but can be seen. Useful to check if item is junk or worth skipping.
			VIEWABLE: 'VIEWABLE',
			// All items are not obtainable.
			UNAVAILABLE: 'UNAVAILABLE',
		}),
		isBoss: false,
	})
	.views(self => ({
		isVisible: () => {
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
				case self.PROGRESSION.PARTIAL:
					return 'is-warning';
				case self.PROGRESSION.AGAHNIM:
					return 'is-info';
				case self.PROGRESSION.POSSIBLE:
					return 'is-success';
				default:
					return 'is-danger';
			}
		},
		get iconClass() {
			let result = '';

			switch (self.currentProgression) {
				case self.PROGRESSION.COMPLETE:
					result = 'fa-check-circle';
					break;
				case self.PROGRESSION.AVAILABLE:
					result = 'fa-exclamation-circle';
					break;
				case self.PROGRESSION.VIEWABLE:
					result = 'fa-question-circle';
					break;
				case self.PROGRESSION.PARTIAL:
					result = 'fa-dot-circle';
					break;
				case self.PROGRESSION.AGAHNIM:
					result = 'fa-times-circle';
					break;
				case self.PROGRESSION.POSSIBLE:
					result = 'fa-dot-circle';
					break;
				default:
					result = self.isBoss ? 'fa-skull' : 'fa-times-circle';
					break;
			}
			return result;
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

			if (self.isBoss) {
				return getParentOfType(self, LocationStore).boss.acquired;
			}
			self.collectables.forEach((collectable) => {
				if (includes(collectable.type, 'boss') && !collectable.acquired) {
					result = false;
				} else if (collectable.qty > 0) {
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
			if (isFunction(parent.availability[parent.name][self.name])) {
				return parent.availability[parent.name][self.name](self);
			}
			if (isFunction(parent.availability[parent.name])) {
				return parent.availability[parent.name]();
			}
			return false;
		},
		get isPartiallyAvailable() {
			const parent = getParentOfType(self, LocationStore);

			if (!parent) {
				return false;
			}
			if (!parent.partialAvailability[parent.name]) {
				return false;
			}
			if (isFunction(parent.partialAvailability[parent.name][self.name])) {
				return parent.partialAvailability[parent.name][self.name](self);
			}
			if (isFunction(parent.partialAvailability[parent.name])) {
				return parent.partialAvailability[parent.name]();
			}
			return false;
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
			return false;
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
			return false;
		},
		get mustDefeatAgahnimFirst() {
			const parent = getParentOfType(self, LocationStore);

			if (!parent) {
				return false;
			}
			if (!parent.mustDefeatAgahnimFirst[parent.name]) {
				return false;
			}
			if (isFunction(parent.mustDefeatAgahnimFirst[parent.name][self.name])) {
				return parent.mustDefeatAgahnimFirst[parent.name][self.name](self);
			}
			if (isFunction(parent.mustDefeatAgahnimFirst[parent.name])) {
				return parent.mustDefeatAgahnimFirst[parent.name]();
			}
			return false;
		},
		get isUnavailable() {
			return self.currentProgression === self.PROGRESSION.UNAVAILABLE;
		},
		get currentProgression() {
			if (self.isDungeonComplete || self.isComplete) {
				return self.PROGRESSION.COMPLETE;
			}
			if (self.isAvailable) {
				return self.PROGRESSION.AVAILABLE;
			}
			if (self.isViewable) {
				return self.PROGRESSION.VIEWABLE;
			}
			if (self.isPartiallyAvailable) {
				return self.PROGRESSION.PARTIAL;
			}
			if (self.mustDefeatAgahnimFirst) {
				return self.PROGRESSION.AGAHNIM;
			}
			if (self.isPossible) {
				return self.PROGRESSION.POSSIBLE;
			}
			return self.PROGRESSION.UNAVAILABLE;
		},
		get collectables() {
			if (self.isBoss) {
				const loc = getParentOfType(self, LocationStore);
				const result = [];

				if (loc) {
					const { prize, medallion } = loc;

					result.push(loc.boss, prize);
					if (medallion) {
						result.push(medallion);
					}
					return result;
				}
			}
			return self.chests;
		},
	}))
	.actions((self) => {
		const setComplete = () => {
			getParentOfType(self, LocationStore).setComplete();
		};
		const selectItem = (item) => {
			self.selectedItem = item;
		};

		return {
			setComplete,
			selectItem,
		};
	});
export default AreaStore;
