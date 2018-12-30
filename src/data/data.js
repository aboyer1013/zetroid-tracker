import zelda3LightWorldLocations from '~/data/locations/zelda3/zelda3-lw';
import zelda3DarkWorldLocations from '~/data/locations/zelda3/zelda3-dw';
import zelda3Dungeons from '~/data/locations/zelda3/zelda3-dungeons';

const gamesData = [
	{ name: 'zelda1', longName: 'The Legend of Zelda' },
	{ name: 'zelda3', longName: 'The Legend of Zelda: A Link to the Past' },
	{ name: 'metroid1', longName: 'Metroid' },
	{ name: 'metroid3', longName: 'Super Metroid' },
];

// Set common data.
const lwLocations = zelda3LightWorldLocations.map((loc) => {
	return Object.assign(loc, {
		game: 'zelda3',
		map: 'zelda3-lw',
	});
});
const dwLocations = zelda3DarkWorldLocations.map((loc) => {
	return Object.assign(loc, {
		game: 'zelda3',
		map: 'zelda3-dw',
	});
});
const locationsData = lwLocations.concat(dwLocations, zelda3Dungeons);

export {
	gamesData,
	locationsData,
};
