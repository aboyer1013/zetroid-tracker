const gamesData = [
	{ name: 'zelda1', longName: 'The Legend of Zelda', },
	{ name: 'zelda3', longName: 'The Legend of Zelda: A Link to the Past' },
	{ name: 'metroid1', longName: 'Metroid' },
	{ name: 'metroid3', longName: 'Super Metroid' },
];
const locationsData = [
	// {
	// 	name: 'linkhouse',
	// 	longName: 'Link’s House',
	// 	coords: [-2825,2240],
	// 	game: 'zelda3',
	// 	map: 'zelda3-lw',
	// 	itemRequirements: ['bomb', 'somaria', 'bottle', 'bow', 'net', 'golden-sword', 'cape', 'hammer'],
	// },
	// {
	// 	name: 'hyrule-castle',
	// 	longName: 'Hyrule Castle',
	// 	coords: [-1800,2050],
	// 	game: 'zelda3',
	// 	map: 'zelda3-lw',
	// 	itemRequirements: ['boots', 'hookshot'],
	// },
	// {
	// 	name: 'pyramid',
	// 	longName: 'Pyramid',
	// 	coords: [-1840,2375],
	// 	game: 'zelda3',
	// 	map: 'zelda3-dw',
	// 	itemRequirements: ['boots', 'hookshot'],
	// },
	{
	    name: 'pedestal',
	    longName: 'Master Sword Pedestal',
	    coords: [-205,170],
	    game: 'zelda3',
	    map: 'zelda3-lw',
	    itemRequirements: ['greenpendant', 'redpendant', 'bluependant'],
		notes: `Can check with ${1+1} %book%.`
	},

];

export {
	gamesData,
	locationsData,
}
