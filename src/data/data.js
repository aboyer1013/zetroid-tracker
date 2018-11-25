const gamesData = [
	{ name: 'zelda1', longName: 'The Legend of Zelda', },
	{ name: 'zelda3', longName: 'The Legend of Zelda: A Link to the Past' },
	{ name: 'metroid1', longName: 'Metroid' },
	{ name: 'metroid3', longName: 'Super Metroid' },
];
const locationsData = [
	{
		name: 'linkhouse',
		longName: 'Link’s House',
		coords: [-2825,2240],
		game: 'zelda3',
		map: 'zelda3-lw'
	},
	{
		name: 'hyrule-castle',
		longName: 'Hyrule Castle',
		coords: [-1800,2050],
		game: 'zelda3',
		map: 'zelda3-lw',
	}
];

export {
	gamesData,
	locationsData,
}
