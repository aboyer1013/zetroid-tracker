import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import { unprotect, applySnapshot, getSnapshot, destroy, onSnapshot, detach } from 'mobx-state-tree';
import { randomId } from './util';
import AppStore from 'App.store';
import MapStore from 'Map.store';
import GameStore from 'Game.store';
import { gamesData, locationsData } from 'data/data';
import ItemStore from 'Item.store';
import itemsData from 'data/items';
import bossData from 'data/bosses';
import LocationStore from 'Location.store';
import LocationDetailStore from 'LocationDetail.store';
import ItemListStore from 'ItemList.store';
import LayoutStore from 'Layout.store';
import * as serviceWorker from 'serviceWorker';
import { isUndefined, isArray } from 'lodash';

const activeItemListStore = ItemListStore.create({
	id: randomId(),
	items: [],
	sortOrder: [],
	droppableId: 'active-itemList-droppable',
});
const inactiveItemListStore = ItemListStore.create({
	id: randomId(),
	items: [],
	sortOrder: [],
	droppableId: 'inactive-itemList-droppable',
});
const activeBossItemListStore = ItemListStore.create({
	id: randomId(),
	items: [],
	sortOrder: [],
	droppableId: 'active-bossItemList-droppable',
});
const inactiveBossItemListStore = ItemListStore.create({
	id: randomId(),
	items: [],
	sortOrder: [],
	droppableId: 'inactive-bossItemList-droppable',
});
const appStore = AppStore.create({
	id: randomId(),
	games: {},
	shouldSync: false,
	activeItemList: activeItemListStore,
	inactiveItemList: inactiveItemListStore,
	activeBossItemList: activeBossItemListStore,
	inactiveBossItemList: inactiveBossItemListStore,
	maps: {},
	locationDetail: LocationDetailStore.create({
		id: randomId(),
		selectedLocation: null,
	}),
	layout: LayoutStore.create({
		id: randomId(),
	})
});

unprotect(appStore);
// Create game models
gamesData.forEach((game) => {
	appStore.games.put(GameStore.create({
		id: randomId(),
		name: game.name,
		longName: game.longName,
	}));
});
// Select the game.
appStore.selectGame('zelda3');
// Create map models.
appStore.maps.put(MapStore.create({
	id: randomId(),
	name: 'zelda3-lw',
	longName: 'Light World Map',
	game: appStore.getGameByName('zelda3'),
	tileLayerTemplate: `${process.env.PUBLIC_URL}/img/maps/zelda3/lw/{z}/zelda3-lw.{x}.{y}.png`,
	locations: {},
	locationDetail: appStore.locationDetail,
}));
// appStore.maps.put(MapStore.create({
// 	id: randomId(),
// 	name: 'zelda3-dw',
// 	longName: 'Dark World Map',
// 	game: appStore.getGameByName('zelda3'),
// 	tileLayerTemplate: `${process.env.PUBLIC_URL}/img/maps/zelda3/dw/{z}/zelda3-dw.{x}.{y}.png`,
// 	locations: {},
// 	locationDetail: appStore.locationDetail,
// 	offset: 100,
// }));
// Create item models.
const itemDataFactory = (item, index, itemList) => {
	const id = randomId();
	const isItemGroup = !!(item.group && item.items.length);
	const itemData = {
		id: id,
		index: isUndefined(item.index) ? index : item.index,
		name: item.name,
		game: appStore.getGameByName(item.game),
		maxQty: item.maxQty || 1,
		itemList,
		type: item.type,
	}

	if (isItemGroup) {
		itemData.isDefault = item.isDefault || false;
		itemData.group = item.group;
		itemData.groupIndex = item.groupIndex || null;
		itemData.type = item.type;
	} else {
		itemData.longName = item.longName;
		itemData.image = item.image
	}

	const subItemData = isItemGroup && item.items.map(data => {
		return ItemStore.create(Object.assign({}, itemData, data, {
			id: randomId(),
			game: appStore.getGameByName(data.game),
		}));
	});
	if (subItemData.length) {
		itemData.items = subItemData;
	}
	return itemData;
};
itemsData
	.filter(item => item.game === appStore.selectedGame.name)
	.forEach((item, i) => {
		const itemData = itemDataFactory(item, i, appStore.activeItemList);

		appStore.activeItemList.sortOrder.push(i);
		appStore.activeItemList.items.push(ItemStore.create(itemData));
	})
;
bossData
	.filter(item => item.game === appStore.selectedGame.name)
	.forEach((item, i) => {
		const itemData = itemDataFactory(item, i, appStore.activeBossItemList);

		appStore.activeBossItemList.sortOrder.push(i);
		appStore.activeBossItemList.items.push(ItemStore.create(itemData));
	})
;
// Create location models.
locationsData.forEach(loc => {
	const selectedMap = appStore.getMapByName(loc.map);

	selectedMap.locations.put(LocationStore.create({
		id: `loc-${randomId()}`,
		name: loc.name,
		longName: loc.longName,
		coords: loc.coords,
		game: appStore.getGameByName(loc.game),
		notes: loc.notes,
		numItems: loc.numItems,
		itemRequirements: loc.itemRequirements,
		viewableRequirements: loc.viewableRequirements,
		isDungeon: !!loc.isDungeon,
	}));

});
// Globals to help with debugging.
// appStore.games.set(zelda1.id, zelda1);
window.applySnapshot = applySnapshot;
window.getSnapshot = getSnapshot;
window.destroy = destroy;
window.detach = detach;
window.appStore = appStore;
window.mapStore = appStore.getMapByName('zelda3-lw');
window.activeItemList = appStore.activeItemList;
window.inactiveItemList = appStore.inactiveItemList;

if (appStore.shouldSync) {
	onSnapshot(appStore, model => {
		if (window.localStorage) {
			window.localStorage.setItem(appStore.LOCAL_STORAGE_KEY, JSON.stringify(model))
		}
	});
	if (window.localStorage && window.localStorage.getItem(appStore.LOCAL_STORAGE_KEY)) {
		applySnapshot(appStore, JSON.parse(window.localStorage.getItem(appStore.LOCAL_STORAGE_KEY)));
	}
}
ReactDOM.render(<App store={appStore} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
