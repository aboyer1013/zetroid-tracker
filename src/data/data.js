const gamesData = [
	{ name: 'zelda1', longName: 'The Legend of Zelda', },
	{ name: 'zelda3', longName: 'The Legend of Zelda: A Link to the Past' },
	{ name: 'metroid1', longName: 'Metroid' },
	{ name: 'metroid3', longName: 'Super Metroid' },
];
let locationsData = [
	{
	    coords: [-1215,2460],
	    name: 'kingsTomb',
	    longName: 'King’s Tomb',
	},
];

locationsData = locationsData.map(loc => {
	return Object.assign(loc, {
		game: 'zelda3',
		map: 'zelda3-lw',
	});
});

export {
	gamesData,
	locationsData,
}
