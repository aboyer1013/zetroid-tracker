let zelda3LightWorldDungeons = [
	{
		coords: [-1590, 3930],
		name: 'easternPalace',
		longName: 'Eastern Palace',
		isDungeon: true,
		boss: 'armos',
		areas: [
			{
				name: 'dungeon',
				longName: 'Dungeon',
				collectables: [{ numChests: 3 }],
			},
		],
	},
	{
		coords: [-3260, 305],
		name: 'desertPalace',
		longName: 'Desert Palace',
		isDungeon: true,
		boss: 'lanmolas',
		areas: [
			{
				name: 'dungeon',
				longName: 'Dungeon',
				collectables: [{numChests: 2}],
				canBeViewable: true,
			},
		],
	},
];
let zelda3DarkWorldDungeons = [

];

zelda3LightWorldDungeons = zelda3LightWorldDungeons.map(dungeon => {
	return Object.assign(dungeon, {
		map: 'zelda3-lw',
		game: 'zelda3',
	});
});

const zelda3Dungeons = zelda3LightWorldDungeons.concat(zelda3DarkWorldDungeons);

export default zelda3Dungeons;
