/* eslint-disable */
import zelda3Dungeons from '~/data/locations/zelda3/zelda3-dungeons';

const itemsData = [
	{ type: ['item'], name: 'bow',            longName: 'Bow',               game: 'zelda3', image: 'bow',  },
	{
		group: 'boomerang',
		game: 'zelda3',
		type: ['item'],
		items: [
			{ type: ['item'], name: 'boomerang',      longName: 'Boomerang',         game: 'zelda3', image: 'boomerang1', group: 'boomerang', groupIndex: 0, isDefault: true, tier: 1, },
			{ type: ['item'], name: 'm-boomerang',    longName: 'Magical Boomerang', game: 'zelda3', image: 'boomerang2', group: 'boomerang', groupIndex: 1, tier: 2, },
			{ type: ['item'], name: 'all-boomerangs',    longName: 'All Boomerangs', game: 'zelda3', image: 'boomerang3', group: 'boomerang', groupIndex: 2, tier: 3, },
		],

	},
	{ type: ['item'], name: 'hookshot',       longName: 'Hookshot',          game: 'zelda3', image: 'hookshot',  },
	// { type: ['item'], name: 'bomb',           longName: 'Bomb',              game: 'zelda3', image: 'bomb1',  },
	{ type: ['item'], name: 'super-bomb',        longName: 'Super Bomb',              game: 'zelda3', image: 'super-bomb', },
	{ type: ['item'], name: 'powder',         longName: 'Magic Powder',      game: 'zelda3', image: 'powder',  },
	{ type: ['item'], name: 'fireRod',        longName: 'Fire Rod',          game: 'zelda3', image: 'firerod',  },
	{ type: ['item'], name: 'iceRod',        longName: 'Ice Rod',           game: 'zelda3', image: 'icerod',  },
	{ type: ['item'], name: 'bombos',         longName: 'Bombos Medallion',  game: 'zelda3', image: 'bombos',  },
	{ type: ['item'], name: 'ether',          longName: 'Ether Medallion',   game: 'zelda3', image: 'ether',  },
	{ type: ['item'], name: 'quake',          longName: 'Quake Medallion',   game: 'zelda3', image: 'quake',  },
	{ type: ['item'], name: 'lantern',        longName: 'Lantern',           game: 'zelda3', image: 'lantern',  },
	{ type: ['item'], name: 'hammer',         longName: 'Magic Hammer',      game: 'zelda3', image: 'hammer',  },
	{ type: ['item'], name: 'flute',          longName: 'Flute',             game: 'zelda3', image: 'flute',  },
	{ type: ['item'], name: 'net',            longName: 'Bug-Catching Net',  game: 'zelda3', image: 'net',  },
	{ type: ['item'], name: 'book',           longName: 'Book of Mudora',    game: 'zelda3', image: 'book',  },
	{ type: ['item'], name: 'bottle',         longName: 'Bottle',            game: 'zelda3', image: 'bottle0', maxQty: 4,  },
	{ type: ['item'], name: 'somaria',        longName: 'Cane of Somaria',   game: 'zelda3', image: 'somaria',  },
	{ type: ['item'], name: 'byrna',          longName: 'Cane of Byrna',     game: 'zelda3', image: 'byrna',  },
	{ type: ['item'], name: 'cape',           longName: 'Magic Cape',        game: 'zelda3', image: 'cape',  },
	{ type: ['item'], name: 'mirror',         longName: 'Magic Mirror',      game: 'zelda3', image: 'mirror',  },
	{ type: ['item'], name: 'boots',          longName: 'Pegasus Boots',     game: 'zelda3', image: 'boots', },
	{ type: ['chest'], name: 'closedchest', longName: 'Closed Chest', game: 'zelda3', image: 'chest-closed', imageEmpty: 'chest-open', acquired: true, },
	{
		group: 'glove',
		game: 'zelda3',
		type: ['item'],
		items: [
			{ type: ['item'], name: 'glove',          longName: 'Power Glove',       game: 'zelda3', image: 'glove1', group: 'glove', groupIndex: 0, isDefault: true, tier: 1, },
			{ type: ['item'], name: 'titanMitt',     longName: 'Titan’s Mitt',      game: 'zelda3', image: 'glove2', group: 'glove', groupIndex: 1, tier: 2, },
		],
	},
	{ type: ['item'], name: 'flippers',       longName: 'Zora’s Flippers',   game: 'zelda3', image: 'flippers', },
	{ type: ['item'], name: 'moonPearl',     longName: 'Moon Pearl',        game: 'zelda3', image: 'moonpearl', },
	{
		group: 'sword',
		game: 'zelda3',
		type: ['item'],
		items: [
			{ type: ['item'], name: 'fighters-sword',          longName: 'Fighter’s Sword',   game: 'zelda3', image: 'sword1', group: 'sword', groupIndex: 0, isDefault: true, tier: 1, },
			{ type: ['item'], name: 'master-sword',   longName: 'Master Sword',      game: 'zelda3', image: 'sword2', group: 'sword', groupIndex: 1, tier: 2, },
			{ type: ['item'], name: 'tempered-sword', longName: 'Tempered Sword',    game: 'zelda3', image: 'sword3', group: 'sword', groupIndex: 2, tier: 3, },
			{ type: ['item'], name: 'golden-sword',   longName: 'Golden Sword',      game: 'zelda3', image: 'sword4', group: 'sword', groupIndex: 3, tier: 4, },
		],
	},
	{
		group: 'shield',
		game: 'zelda3',
		type: ['item'],
		items: [
			{ type: ['item'], name: 'shield',         longName: 'Fighter’s Shield',  game: 'zelda3', image: 'shield1', group: 'shield', groupIndex: 0, isDefault: true, tier: 1, },
			{ type: ['item'], name: 'red-shield',     longName: 'Red Shield',        game: 'zelda3', image: 'shield2', group: 'shield', groupIndex: 1, tier: 2, },
			{ type: ['item'], name: 'mirrorShield',  longName: 'Mirror Shield',     game: 'zelda3', image: 'shield3', group: 'shield', groupIndex: 2, tier: 3, },
		],
	},
	{
		group: 'armor',
		game: 'zelda3',
		type: ['item'],
		items: [
			{ type: ['item'], name: 'jerkin',         longName: 'Green Jerkin',      game: 'zelda3', image: 'tunic1', group: 'armor', groupIndex: 0, isDefault: true, tier: 1, autoAcquire: true, },
			{ type: ['item'], name: 'blue-mail',      longName: 'Blue Mail',         game: 'zelda3', image: 'tunic2', group: 'armor', groupIndex: 1, tier: 2, },
			{ type: ['item'], name: 'red-mail',       longName: 'Red Mail',          game: 'zelda3', image: 'tunic3', group: 'armor', groupIndex: 2, tier: 3, },
		],
	},
	{
		group: 'mpUpgrade',
		game: 'zelda3',
		type: ['item'],
		items: [
			{ type: ['item'], name: 'mpUpgrade11',  longName: '1/1 Magic',         game: 'zelda3', image: 'mpupgrade0', group: 'mpUpgrade', groupIndex: 0, isDefault: true, tier: 1, autoAcquire: true, },
			{ type: ['item'], name: 'mpUpgrade12',  longName: '1/2 Magic',         game: 'zelda3', image: 'mpupgrade1', group: 'mpUpgrade', groupIndex: 1, tier: 2, },
			{ type: ['item'], name: 'mpUpgrade14',  longName: '1/4 Magic',         game: 'zelda3', image: 'mpupgrade2', group: 'mpUpgrade', groupIndex: 2, tier: 3, },
		]
	},
	{ type: ['item'], name: 'heart-c',        longName: 'Heart Container',   game: 'zelda3', image: 'heartcontainer', maxQty: 11, },
	{ type: ['item'], name: 'heart-p',        longName: 'Heart Piece',       game: 'zelda3', image: 'heartpiece', maxQty: 24, },
	{ type: ['item'], name: 'mushroom',       longName: 'Mushroom',          game: 'zelda3', image: 'mushroom', },

	{ type: ['item'], name: 'shovel',         longName: 'Shovel',            game: 'zelda3', image: 'shovel', },
	{ type: ['item'], name: 's-arrow',        longName: 'Silver Arrow',      game: 'zelda3', image: 'silvers', },
	{ type: ['item'], name: 'agahnim',  longName: 'Agahnim', game: 'zelda3', image: 'agahnim', },
	{ type: ['item'], name: 'junk',  longName: 'Junk', game: 'zelda3', image: 'junk', hidden: true, },
	// {
	// 	group: 'agahnim',
	// 	game: 'zelda3',
	// 	items: [
	// 		{ type: ['item'], name: 'agahnim-alive',  longName: 'Agahnim',           game: 'zelda3', image: 'agahnim0', group: 'agahnim', groupIndex: 0, isDefault: true, },
	// 		{ type: ['item'], name: 'agahnim-dead',   longName: 'Agahnim Defeated',  game: 'zelda3', image: 'agahnim1', group: 'agahnim', groupIndex: 1, },
	// 	],
	// },
	// { type: ['item'], name: 'arrow-upgrade',  longName: 'Arrow Upgrade',     game: 'zelda3', image: '', },
	// { type: ['item'], name: 'greenPendant',   longName: 'Pendant of Courage', game: 'zelda3', image: 'greenpendant', },
	// { type: ['item'], name: 'bluependant',   longName: 'Pendant of Power', game: 'zelda3', image: 'bluependant', },
	// { type: ['item'], name: 'redpendant',     longName: 'Pendant of Wisdom', game: 'zelda3', image: 'redpendant', },





	{ type: ['item'], name: 'bracelet', longName: 'Power Bracelet', game: 'zelda1', },
	{ type: ['item'], name: 'lantern', longName: 'Lantern', game: 'zelda1', },
	{ type: ['item'], name: 'food', longName: 'Food', game: 'zelda1', },
	{ type: ['item'], name: 'ladder', longName: 'Ladder', game: 'zelda1', },
	{ type: ['item'], name: 'letter', longName: 'Letter', game: 'zelda1', },
	{ type: ['item'], name: 'm-key', longName: 'Magic Key', game: 'zelda1', },
	{ type: ['item'], name: 'm-rod', longName: 'Magic Rod', game: 'zelda1', },
	{ type: ['item'], name: 'raft', longName: 'Raft', game: 'zelda1', },
	{ type: ['item'], name: 'recorder', longName: 'Recorder', game: 'zelda1', },
	{ type: ['item'], name: 'ring', longName: 'Red Ring', game: 'zelda1', },
	{ type: ['item'], name: 'triforce-1', longName: 'Triforce Piece 1', game: 'zelda1', },
	{ type: ['item'], name: 'triforce-2', longName: 'Triforce Piece 2', game: 'zelda1', },
	{ type: ['item'], name: 'triforce-3', longName: 'Triforce Piece 3', game: 'zelda1', },
	{ type: ['item'], name: 'triforce-4', longName: 'Triforce Piece 4', game: 'zelda1', },
	{ type: ['item'], name: 'triforce-5', longName: 'Triforce Piece 5', game: 'zelda1', },
	{ type: ['item'], name: 'triforce-6', longName: 'Triforce Piece 6', game: 'zelda1', },
	{ type: ['item'], name: 'triforce-7', longName: 'Triforce Piece 7', game: 'zelda1', },
	{ type: ['item'], name: 'triforce-8', longName: 'Triforce Piece 8', game: 'zelda1', },

	{ type: ['item'], name: 'long', longName: 'Long Beam', game: 'metroid1', },
	{ type: ['item'], name: 'kraidtotem', longName: 'Kraid Totem', game: 'metroid1', },
	{ type: ['item'], name: 'ridleytotem', longName: 'Ridley Totem', game: 'metroid1', },
];

zelda3Dungeons.forEach(dungeon => {
	if (!dungeon.hasPrize && !dungeon.hasMedallion) {
		return true;
	}
	if (dungeon.hasPrize) {
		const group = `prize-${dungeon.name}`;
		itemsData.push(
			{
				group,
				game: 'zelda3',
				type: ['dungeon-item', 'prize'],
				items: [
					{ group, type: ['dungeon-item', 'prize', 'crystal'], name: 'crystal',   longName: 'Crystal', game: 'zelda3', image: 'dungeon0', groupIndex: 0, isDefault: true, autoAcquire: true, },
					{ group, type: ['dungeon-item', 'prize', 'crystal', 'orangeCrystal'], name: 'crystal56',   longName: '5th/6th Crystal ', game: 'zelda3', image: 'dungeon1', groupIndex: 1, },
					{ group, type: ['dungeon-item', 'prize', 'pendant'], name: 'blueredpendant',   longName: 'Pendant of Power / Wisdom', game: 'zelda3', image: 'dungeon2', groupIndex: 2, },
					{ group, type: ['dungeon-item', 'prize', 'pendant'], name: 'greenPendant',   longName: 'Pendant of Courage', game: 'zelda3', image: 'greenpendant', groupIndex: 3, },
				],
			},
		);
	}
	if (dungeon.hasMedallion) {
		const group = `medallion-${dungeon.name}`;
		itemsData.push(
			{
				group,
				game: 'zelda3',
				type: ['dungeon-item'],
				items: [
					{ group, type: ['dungeon-item'], name: 'unknownMedallion', longName: 'Unknown Medallion', game: 'zelda3', image: 'medallion0', isDefault: true, autoAcquire: true, groupIndex: 0, },
					{ group, type: ['dungeon-item'], name: 'bombos',         longName: 'Bombos Medallion',  game: 'zelda3', image: 'bombos', groupIndex: 1, },
					{ group, type: ['dungeon-item'], name: 'ether',          longName: 'Ether Medallion',   game: 'zelda3', image: 'ether', groupIndex: 2, },
					{ group, type: ['dungeon-item'], name: 'quake',          longName: 'Quake Medallion',   game: 'zelda3', image: 'quake', groupIndex: 3, },
				],
			},
		)
	}
	return true;
});

export default itemsData;
