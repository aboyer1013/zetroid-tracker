import { mapValues } from 'lodash';

export const itemList = {
	boots: false,
	book: false,
	hookshot: false,
	cape: false,
	byrna: false,
	flippers: false,
	gloves: false,
	titanMitt: false,
	fireRod: false,
	lantern: false,
	bombos: false,
	bow: false,
	mirrorShield: false,
	net: false,
	bottle: false,
	quake: false,
	moonPearl: false,
	agahnim: false,
};
export const applyItemLoadout = (items, overrides = {}, name = 'empty') => {
	let result = {};

	switch (name) {
		case 'empty':
		default:
			result = mapValues(items, () => false);
			break;
		case 'full':
			result = mapValues(items, () => true);
			break;
	}
	return Object.assign(result, overrides);
};
