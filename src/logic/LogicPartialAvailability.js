import { types, getRoot } from 'mobx-state-tree';
import { head } from 'lodash';

const LogicPartialAvailability = types.model().volatile(self => {
	return {
		partialAvailability: {
			easternPalace: {
				dungeon: area => {
					const abl = self.abilities;
					const chests = head([...area.collectables.values()]);

					if (abl.hasItem('lantern') && !abl.hasItem('bow') && chests.qty < 2) {
						return true;
					}
					if (chests.qty !== chests.maxQty) {
						return true;
					}
					return false;
				},
			},
		},
	};
});

export default LogicPartialAvailability;
