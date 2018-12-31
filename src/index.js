import React from 'react';
import ReactDOM from 'react-dom';
import App from '~/App';
import {
	unprotect, applySnapshot, getSnapshot, destroy, onSnapshot, detach, getParentOfType, getParent,
} from 'mobx-state-tree';
import { randomId } from '~/utilities/util';
import AppStore from '~/App.store';
import MapStore from '~/Map.store';
import GameStore from '~/Game.store';
import ItemStore from '~/Item.store';
import itemsData from '~/data/items';
import bossData from '~/data/bosses';
import { gamesData, locationsData } from '~/data/data';
import LocationStore from '~/Location.store';
import ItemListStore from '~/ItemList.store';
import LayoutStore from '~/Layout.store';
import ConfigStore from '~/Config.store';
import AbilitiesStore from '~/Abilities.store';
import AreaStore from '~/Area.store';
import LocationDetailStore from '~/LocationDetail.store';
import * as serviceWorker from '~/serviceWorker';
import {
	isUndefined, find, includes, isEmpty,
} from 'lodash';
import { createStorage } from 'persistme';

const shouldSync = true;
const configStore = ConfigStore.create({
	id: randomId(),
});
const activeItemListStore = ItemListStore.create({
	id: randomId(),
	items: [],
	sortOrder: [],
	droppableId: 'active-itemList-droppable',
	config: configStore,
});
const inactiveItemListStore = ItemListStore.create({
	id: randomId(),
	items: [],
	sortOrder: [],
	droppableId: 'inactive-itemList-droppable',
	config: configStore,
});
const activeDungeonItemListStore = ItemListStore.create({
	id: randomId(),
	items: [],
	sortOrder: [],
	droppableId: 'active-bossItemList-droppable',
	config: configStore,
});
const inactiveDungeonItemListStore = ItemListStore.create({
	id: randomId(),
	items: [],
	sortOrder: [],
	droppableId: 'inactive-bossItemList-droppable',
	config: configStore,
});
const appStore = AppStore.create({
	id: randomId(),
	version: 1,
	configStore,
	config: configStore,
	abilities: AbilitiesStore.create({
		id: randomId(),
		config: configStore,
	}),
	games: {},
	shouldSync,
	activeItemList: activeItemListStore,
	inactiveItemList: inactiveItemListStore,
	activeDungeonItemList: activeDungeonItemListStore,
	inactiveDungeonItemList: inactiveDungeonItemListStore,
	maps: {},
	locationDetail: LocationDetailStore.create({
		id: randomId(),
		selectedLocation: null,
	}),
	layout: LayoutStore.create({
		id: randomId(),
	}),
	itemSelectStore: null,
	selectedAreaStore: null,
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
}));
// Create item models.
// TODO Consider not cherry-picking item fields and just apply all the data at once - or use defaults
const itemDataFactory = (item, index = 0) => {
	const id = randomId();
	const isItemGroup = !!(item.group && item.items.length);

	const itemData = {
		id,
		index: isUndefined(item.index) ? index : item.index,
		name: item.name,
		game: appStore.getGameByName(item.game),
		qty: item.qty || 0,
		maxQty: item.maxQty || 1,
		type: item.type,
		acquired: item.acquired,
		imageEmpty: item.imageEmpty,
		tier: item.tier || null,
	};

	if (isItemGroup) {
		itemData.isDefault = item.isDefault || false;
		itemData.group = item.group;
		itemData.groupIndex = item.groupIndex || null;
	} else {
		itemData.longName = item.longName;
		itemData.image = item.image;
		itemData.autoAcquire = item.autoAcquire;
	}

	const subItemData = isItemGroup && item.items.map((data) => {
		return ItemStore.create(Object.assign({}, itemData, data, {
			id: randomId(),
			game: appStore.getGameByName(data.game),
			autoAcquire: data.autoAcquire,
			acquired: data.autoAcquire,
		}));
	});
	if (subItemData.length) {
		itemData.items = subItemData;
	}
	return itemData;
};
const gameItemsData = itemsData.filter(item => item.game === appStore.selectedGame.name);
gameItemsData.filter(item => includes(item.type, 'item')).forEach((item, i) => {
	const itemData = itemDataFactory(item, i);

	appStore.activeItemList.sortOrder.push(i);
	appStore.activeItemList.items.push(ItemStore.create(itemData));
});
// Add the dungeon items for a separate list.
// FIXME I'm calling it bosses, but it should really be dungeons.
const gameBossData = bossData.filter(item => item.game === appStore.selectedGame.name);
gameBossData.concat(gameItemsData.filter(item => includes(item.type, 'dungeon-item'))).forEach((item, i) => {
	const itemData = itemDataFactory(item, i);

	appStore.activeDungeonItemList.sortOrder.push(i);
	appStore.activeDungeonItemList.items.push(ItemStore.create(itemData));
});
// Create location models.
locationsData.forEach((loc) => {
	let boss = null;
	let prize = null;
	const selectedMap = appStore.getMapByName(loc.map);
	const chestItem = null;
	const areas = [];

	// Create the boss area
	if (loc.isDungeon) {
		boss = appStore.getItemByName(loc.boss);
		prize = appStore.getItemGroupByName(`prize-${loc.name}`);
		loc.areas.push({
			isBoss: true,
			name: boss.name,
			longName: boss.longName,
			chests: [],
		});
	}
	loc.areas.forEach((area) => {
		const chests = [];
		const itemSelectStore = area.canBeViewable ? appStore.itemSelectStore : null;

		area.chests.forEach((collectable) => {
			const chestItemData = find(gameItemsData, { name: 'closedchest' });
			const type = chestItemData.type.slice(0);

			type.push('collectable');
			if (loc.isDungeon) {
				type.push('dungeon-item');
			}
			chestItemData.qty = collectable.numChests;
			chestItemData.maxQty = collectable.numChests;
			chestItemData.type = type;
			chests.push(ItemStore.create(itemDataFactory(chestItemData)));
		});
		areas.push(AreaStore.create({
			id: randomId(),
			isBoss: area.isBoss || false,
			name: area.name,
			longName: area.longName,
			abilities: appStore.abilities,
			chests,
			canBeViewable: area.canBeViewable || false,
			itemSelectStore,
			selectedItem: area.selectedItem || null,
		}));
	});

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
		// TODO remove chest
		chest: chestItem,
		numChests: loc.numChests,
		boss,
		prize,
		map: selectedMap,
		abilities: appStore.abilities,
		areas,
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
window.createStorage = createStorage;
window.getParentOfType = getParentOfType;
window.ItemListStore = ItemListStore;
window.LocationStore = LocationStore;
window.getParent = getParent;

if (appStore.shouldSync) {
	const gameStorage = appStore.getGameStorage('tree');

	onSnapshot(appStore, (model) => {
		appStore.updateGameTreeStorage(model);
	});
	if (!isEmpty(gameStorage)) {
		applySnapshot(appStore, gameStorage);
	}
}
ReactDOM.render(<App store={appStore} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
