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
				chests: [{ numChests: 3 }],
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
				chests: [{ numChests: 2 }],
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
				chests: [{ numChests: 2 }],
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
				chests: [{ numChests: 5 }],
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
				chests: [{ numChests: 6 }],
			},
		],
	},
	{
		coords: [-200, 160],
		name: 'skullWoods',
		longName: 'Skull Woods',
		isDungeon: true,
		hasPrize: true,
		boss: 'mothula',
		areas: [
			{
				name: 'dungeon',
				longName: 'Dungeon',
				chests: [{ numChests: 2 }],
			},
		],
	},
	{
		coords: [-1990, 512],
		name: 'thievesTown',
		longName: 'Thieves’ Town',
		isDungeon: true,
		hasPrize: true,
		boss: 'blindTheThief',
		areas: [
			{
				name: 'dungeon',
				longName: 'Dungeon',
				chests: [{ numChests: 4 }],
			},
		],
	},
	{
		coords: [-3530, 3263],
		name: 'icePalace',
		longName: 'Ice Palace',
		isDungeon: true,
		hasPrize: true,
		boss: 'kholdstare',
		areas: [
			{
				name: 'dungeon',
				longName: 'Dungeon',
				chests: [{ numChests: 3 }],
			},
		],
	},
	{
		coords: [-3290, 305],
		name: 'miseryMire',
		longName: 'Misery Mire',
		isDungeon: true,
		hasPrize: true,
		hasMedallion: true,
		boss: 'vitreous',
		areas: [
			{
				name: 'dungeon',
				longName: 'Dungeon',
				chests: [{ numChests: 2 }],
			},
		],
	},
	{
		coords: [-330, 3855],
		name: 'turtleRock',
		longName: 'Turtle Rock',
		isDungeon: true,
		hasPrize: true,
		hasMedallion: true,
		boss: 'trinexx',
		areas: [
			{
				name: 'dungeon',
				longName: 'Dungeon',
				chests: [{ numChests: 5 }],
			},
		],
	},
	{
		coords: [-70, 2303],
		name: 'ganonsTower',
		longName: 'Ganon’s Tower',
		areas: [
			{
				name: 'dungeon',
				longName: 'Dungeon',
				chests: [{ numChests: 5 }],
			},
		],
	},
];

zelda3LightWorldDungeons = zelda3LightWorldDungeons.map((dungeon) => {
	return Object.assign(dungeon, {
		map: 'zelda3-lw',
		game: 'zelda3',
	});
});
zelda3DarkWorldDungeons = zelda3DarkWorldDungeons.map((dungeon) => {
	return Object.assign(dungeon, {
		map: 'zelda3-dw',
		game: 'zelda3',
	});
});

const zelda3Dungeons = zelda3LightWorldDungeons.concat(zelda3DarkWorldDungeons);

export default zelda3Dungeons;
