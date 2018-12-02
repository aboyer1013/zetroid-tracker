import { types, applySnapshot } from 'mobx-state-tree';
import GameStore from 'Game.store';
import ItemListStore from 'ItemList.store';
import MapStore from 'Map.store';
import LocationDetailStore from 'LocationDetail.store';
import ItemListUtil from 'ItemListUtil';
import LayoutStore from 'Layout.store';
import { find } from 'lodash';
import { createStorage } from 'persistme';

const AppStore = types.compose(ItemListUtil, types.model({
		games: types.map(GameStore),
		activeItemList: ItemListStore,
		inactiveItemList: ItemListStore,
		activeBossItemList: ItemListStore,
		inactiveBossItemList: ItemListStore,
		maps: types.map(MapStore),
		locationDetail: LocationDetailStore,
		isModalOpen: false,
		activeModal: types.maybeNull(types.enumeration('Modals', ['FILE_IMPORT', 'FILE_EXPORT', 'HELP', 'EDIT_ITEM_LIST'])),
		validationMessages: types.array(types.string),
		LOCAL_STORAGE_KEY: 'zetroid-tracker',
		LOCAL_STORAGE_LAYOUT_KEY: 'zetroid-tracker-layout',
		hideCompleted: false,
		shouldSync: true,
		layout: LayoutStore,
	})
	.views((self) => ({
		getGameByName: (name) => {
			return find([...self.games.values()], { name });
		},
		getMapByName: (name) => {
			return find([...self.maps.values()], { name });
		},
		get selectedGame() {
			return find([...self.games.values()], { selected: true });
		},
		getItemListStoreByDroppableId: (droppableId) => {
			return find(self.itemListStores, { droppableId });
		},
		get items() {
			return (
				self.activeItemList.items.concat(
					self.inactiveItemList.items,
					self.activeBossItemList.items,
					self.inactiveBossItemList.items,
				)
			);
		},
		get itemListStores() {
			return [
				self.inactiveItemList,
				self.activeItemList,
				self.inactiveBossItemList,
				self.activeBossItemList,
			];
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
		const flushLocalStorage = (event, game = null) => {
			const appStorage = createStorage(self.LOCAL_STORAGE_KEY);
			const selectedGame = game || self.selectedGame.name;

			appStorage.remove(selectedGame);
			window.location.reload();
		};
		const setHideCompleted = (isHidden) => {
			self.hideCompleted = isHidden;
		};
		// Wrapper for persistme to include the selected game in the storage key.
		const getGameStorage = (key = null) => {
			const appStorage = createStorage(self.LOCAL_STORAGE_KEY);
			const selectedGame = self.selectedGame.name;

			if (!key) {
				return appStorage.get(selectedGame);
			}
			const storageData = appStorage.get(selectedGame);
			if (!storageData) {
				return null;
			}
			return storageData[key];
		};
		const updateGameTreeStorage = data => {
			if (!self.shouldSync) {
				return;
			}
			const appStorage = createStorage(self.LOCAL_STORAGE_KEY);
			const selectedGame = self.selectedGame.name;

			return appStorage.update(selectedGame, {tree: data})
		};
		const updateGameLayoutStorage = data => {
			if (!self.shouldSync) {
				return;
			}
			const appStorage = createStorage(self.LOCAL_STORAGE_KEY);
			const selectedGame = self.selectedGame.name;

			return appStorage.update(selectedGame, {layout: data})
		};

		return {
			selectGame,
			openModal,
			closeModal,
			loadSnapshot,
			flushLocalStorage,
			setHideCompleted,
			getGameStorage,
			updateGameLayoutStorage,
			updateGameTreeStorage,
		};
	}))
;

export default AppStore;
