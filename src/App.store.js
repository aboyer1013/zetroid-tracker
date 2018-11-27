import { types, applySnapshot } from 'mobx-state-tree';
import GameStore from './Game.store';
import ItemStore from './Item.store';
import MapStore from 'Map.store';
import LocationDetailStore from 'LocationDetail.store';
import { find } from 'lodash';

const AppStore = types
	.model({
		games: types.map(GameStore),
		items: types.map(ItemStore),
		maps: types.map(MapStore),
		locationDetail: LocationDetailStore,
		isModalOpen: false,
		activeModal: types.maybeNull(types.enumeration('Modals', ['FILE_IMPORT', 'FILE_EXPORT'])),
		validationMessages: types.array(types.string),
		LOCAL_STORAGE_KEY: 'zetroid-tracker',
	})
	.views((self) => ({
		getGameByName: (name) => {
			return find([...self.games.values()], { name });
		},
		getMapByName: (name) => {
			return find([...self.maps.values()], { name });
		},
		getItemByName: (name) => {
			return find([...self.items.values()], { name });
		},
		get selectedGame() {
			return find([...self.games.values()], { selected: true });
		}
	}))
	.actions((self) => {
		const selectGame = (gameToSelect) => {
			const selectedGame = self.getGameByName(gameToSelect);

			[...self.games.values()].forEach((game) => {
				if (selectedGame === game) {
					game.setSelected(true);
				} else {
					game.setSelected(false);
				}
			});
		};
		const openModal = (modalName) => {
			self.isModalOpen = true;
			self.activeModal = modalName;
		};
		const closeModal = () => {
			self.activeModal = null;
			self.isModalOpen = false;
		};
		const loadSnapshot = (json) => {
			let parsedJson;

			try {
				parsedJson = JSON.parse(json);
				self.closeModal();
				applySnapshot(self, parsedJson);

			} catch (error) {
				// Invalid JSON
				self.validationMessages = ['Invalid JSON.'];
			}
		};
		const flushLocalStorage = () => {
			if (window.localStorage) {
				window.localStorage.removeItem(self.LOCAL_STORAGE_KEY);
			}
		};

		return {
			selectGame,
			openModal,
			closeModal,
			loadSnapshot,
			flushLocalStorage,
		};
	})
;

export default AppStore;
