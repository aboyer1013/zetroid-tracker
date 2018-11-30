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
	    coords: [-205,170],
	    name: 'pedestal',
	    longName: 'Master Sword Pedestal',
	    game: 'zelda3',
	    map: 'zelda3-lw',
	    itemRequirements: ['greenpendant', 'redpendant', 'bluependant'],
		notes: ['pedestal'],
	},
	{
	    coords: [-355,500],
	    name: 'mushroom',
	    longName: 'Mushroom',
	    game: 'zelda3',
	    map: 'zelda3-lw',
	    itemRequirements: [],
	},
	{
	    coords: [-540,775],
	    name: 'foresthideout',
	    longName: 'Forest Hideout',
	    game: 'zelda3',
	    map: 'zelda3-lw',
	    itemRequirements: [],
	},
	{
	    coords: [-300,1230],
	    name: 'lumberjacktree',
	    longName: 'Lumberjack Tree',
	    game: 'zelda3',
	    map: 'zelda3-lw',
	    itemRequirements: ['agahnim', 'boots'],
		isViewable: true,
	},

];

export {
	gamesData,
	locationsData,
}
