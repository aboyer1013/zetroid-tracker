import { types, applySnapshot } from 'mobx-state-tree';
import GameStore from 'Game.store';
import ItemListStore from 'ItemList.store';
import MapStore from 'Map.store';
import LocationDetailStore from 'LocationDetail.store';
import ItemListUtil from 'ItemListUtil';
import LayoutStore from 'Layout.store';
import { find } from 'lodash';

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
			if (self.activeItemList.droppableId === droppableId) {
				return self.activeItemList;
			}
			if (self.inactiveItemList.droppableId === droppableId) {
				return self.inactiveItemList;
			}
			return null;
		},
		get items() {
			return (
				self.activeItemList.items.concat(
					self.inactiveItemList.items,
					self.activeBossItemList,
					self.inactiveBossItemList
				)
			);
		},
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
				window.location.reload();
			}
		};
		const setHideCompleted = (isHidden) => {
			self.hideCompleted = isHidden;
		};

		return {
			selectGame,
			openModal,
			closeModal,
			loadSnapshot,
			flushLocalStorage,
			setHideCompleted,
		};
	}))
;

export default AppStore;
