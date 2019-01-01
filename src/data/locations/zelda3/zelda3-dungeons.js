let zelda3LightWorldDungeons = [
	{
		coords: [-1590, 3930],
		name: 'easternPalace',
		longName: 'Eastern Palace',
		isDungeon: true,
		hasPrize: true,
		boss: 'armos',
		areas: [
			{
				name: 'dungeon',
				longName: 'Dungeon',
				chests: [
					{numChests: 3},
				],
			},
		],
	},
	{
		coords: [-3260, 305],
		name: 'desertPalace',
		longName: 'Desert Palace',
		isDungeon: true,
		hasPrize: true,
		boss: 'lanmolas',
		areas: [
			{
				name: 'dungeon',
				longName: 'Dungeon',
				chests: [
					{numChests: 2},
				],
				canBeViewable: true,
			},
		],
	},
	{
		coords: [-130, 2295],
		name: 'towerOfHera',
		longName: 'Tower of Hera',
		isDungeon: true,
		hasPrize: true,
		boss: 'moldorm',
		areas: [
			{
				name: 'dungeon',
				longName: 'Dungeon',
				chests: [{numChests: 2}],
			},
		],
	},
];
let zelda3DarkWorldDungeons = [
	{
		coords: [-1600, 3930],
		name: 'palaceOfDarkness',
		longName: 'Palace of Darkness',
		isDungeon: true,
		hasPrize: true,
		boss: 'helmasaur',
		areas: [
			{
				name: 'dungeon',
				longName: 'Dungeon',
				chests: [{numChests: 5}],
			},
		],
	},
	{
		coords: [-3830, 1920],
		name: 'swampPalace',
		longName: 'Swamp Palace',
		isDungeon: true,
		hasPrize: true,
		boss: 'arrghus',
		areas: [
			{
				name: 'dungeon',
				longName: 'Dungeon',
				chests: [{numChests: 6}],
			},
		],
	},
];

zelda3LightWorldDungeons = zelda3LightWorldDungeons.map(dungeon => {
	return Object.assign(dungeon, {
		map: 'zelda3-lw',
		game: 'zelda3',
	});
});
zelda3DarkWorldDungeons = zelda3DarkWorldDungeons.map(dungeon => {
	return Object.assign(dungeon, {
		map: 'zelda3-dw',
		game: 'zelda3',
	});
});

const zelda3Dungeons = zelda3LightWorldDungeons.concat(zelda3DarkWorldDungeons);

export default zelda3Dungeons;
