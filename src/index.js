import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import { unprotect, applySnapshot, getSnapshot, destroy, onSnapshot } from 'mobx-state-tree';
import { randomId } from './util';
import AppStore from 'App.store';
import MapStore from 'Map.store';
import GameStore from 'Game.store';
import { gamesData, locationsData } from 'data/data';
import ItemStore from 'Item.store';
import itemsData from 'data/items';
import LocationStore from 'Location.store';
import LocationDetailStore from 'LocationDetail.store';
import ItemListStore from 'ItemList.store';
import * as serviceWorker from 'serviceWorker';
import { isUndefined } from 'lodash';

const appStore = AppStore.create({
	id: randomId(),
	games: {},
	// shouldSync: false,
	itemList: ItemListStore.create({
		id: randomId(),
		items: [],
		sortOrder: [],
	}),
	inactiveItemList: ItemListStore.create({
		id: randomId(),
		items: [],
		sortOrder: [],
	}),
	maps: {},
	locationDetail: LocationDetailStore.create({
		id: randomId(),
		selectedLocation: null,
	}),
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
appStore.maps.put(MapStore.create({
	id: randomId(),
	name: 'zelda3-dw',
	longName: 'Dark World Map',
	game: appStore.getGameByName('zelda3'),
	tileLayerTemplate: `${process.env.PUBLIC_URL}/img/maps/zelda3/dw/{z}/zelda3-dw.{x}.{y}.png`,
	locations: {},
	locationDetail: appStore.locationDetail,
	offset: 100,
}));
// Create item models.
const itemDataFactory = (item, index, itemList) => {
	const isItemGroup = !!(item.group && item.items.length);
	const itemData = {
		id: randomId(),
		index: isUndefined(item.index) ? index : item.index,
		name: item.name,
		game: appStore.getGameByName(item.game),
		maxQty: item.maxQty || 1,
		itemList,
	}

	if (isItemGroup) {
		itemData.isDefault = item.isDefault || false;
		itemData.group = item.group;
		itemData.groupIndex = item.groupIndex || null;
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
	// .filter(item => item.group === 'mp-upgrade' || item.name === 'hookshot' || item.maxQty > 1)
	.forEach((item, i) => {
		const itemData = itemDataFactory(item, i, appStore.itemList);
		const inactiveItemData = itemDataFactory(item, i, appStore.inactiveItemList);

		appStore.itemList.sortOrder.push(i);
		appStore.itemList.items.push(ItemStore.create(itemData));
		appStore.inactiveItemList.sortOrder.push(i);
		appStore.inactiveItemList.items.push(ItemStore.create(inactiveItemData));
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
		itemRequirements: loc.itemRequirements,
	}));

});
// Globals to help with debugging.
// appStore.games.set(zelda1.id, zelda1);
window.applySnapshot = applySnapshot;
window.getSnapshot = getSnapshot;
window.destroy = destroy;
window.appStore = appStore;
window.mapStore = appStore.getMapByName('zelda3-lw');

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
