import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import { unprotect } from 'mobx-state-tree';
import { randomId } from './util';
import AppStore from 'App.store';
import Game from 'Game.store';
import gamesData from 'data/data';
import Item from 'Item.store';
import itemsData from 'data/items';
import * as serviceWorker from 'serviceWorker';

const appStore = AppStore.create({
	id: randomId(),
	games: {},
	items: {},
});

unprotect(appStore);
gamesData.forEach((game) => {
	appStore.games.put(Game.create({
		id: randomId(),
		name: game.name,
		longName: game.longName,
	}));
});
itemsData.forEach((item) => {
	// console.log(appStore.getGameByName(item.game));
	appStore.items.put(Item.create({
		id: randomId(),
		name: item.name,
		longName: item.longName,
		game: appStore.getGameByName(item.game),
	}));
});
appStore.selectGame('zelda3');
// appStore.games.set(zelda1.id, zelda1);
window.appStore = appStore;

ReactDOM.render(<App store={appStore} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
