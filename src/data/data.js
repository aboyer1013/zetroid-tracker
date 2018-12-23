const gamesData = [
	{ name: 'zelda1', longName: 'The Legend of Zelda', },
	{ name: 'zelda3', longName: 'The Legend of Zelda: A Link to the Past' },
	{ name: 'metroid1', longName: 'Metroid' },
	{ name: 'metroid3', longName: 'Super Metroid' },
];
let z3LwLocationsData = [
	{
	    coords: [-1215,2463],
	    name: 'kingsTomb',
	    longName: 'King’s Tomb',
		areas: [
			{
				name: 'theCrypt',
				longName: 'The Crypt',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
	    coords: [-3830,1920],
	    name: 'dam',
	    longName: 'Dam',
	    areas: [
	        {
	        	name: 'inside',
	            longName: 'Inside',
	            collectables: [{ numChests: 1 }],
	        },
		    {
		    	name: 'outside',
		        longName: 'Outside',
		        collectables: [{ numChests: 1 }],
		    },
	    ],

	},
	{
	    coords: [-2823,2240],
	    name: 'linksHouse',
	    longName: 'Link’s House',
	    areas: [
	        {
	        	name: 'byTheDoor',
	            longName: 'By the Door',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
	    coords: [-368,3263],
	    name: 'spiralCave',
	    longName: 'Spiral Cave',
	    areas: [
	        {
	        	name: 'cave',
	            longName: 'Cave',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
	    coords: [-368,3455],
	    name: 'mimicCave',
	    longName: 'Mimic Cave',
	    areas: [
	        {
	        	name: 'cave',
	            longName: 'Cave',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
	    coords: [-2320,655],
	    name: 'tavern',
	    longName: 'Tavern',
	    areas: [
	        {
	        	name: 'backRoom',
	            longName: 'Back Room',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
	    coords: [-2390,448],
	    name: 'chickenHouse',
	    longName: 'Chicken House',
	    areas: [
	        {
	        	name: 'bombableWall',
	            longName: 'Bombable Wall',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
	    coords: [-3377,815],
	    name: 'aginahsCave',
	    longName: 'Aginah’s Cave',
	    areas: [
	        {
	        	name: 'cave',
	            longName: 'Cave',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
		coords: [-1855,3320],
		name: 'sahasrahlasHut',
		longName: 'Sahasrahla’s Hut',
		areas: [
			{
				name: 'cave',
				longName: 'Cave',
				collectables: [{ numChests: 3 }],
			},
			{
				name: 'sahasrahla',
				longName: 'Sahasrahla',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
	    coords: [-1743,95],
	    name: 'kakarikoWell',
	    longName: 'Kakariko Well',
	    areas: [
	        {
	            name: 'cave',
	            longName: 'Cave',
	            collectables: [{ numChests: 4 }],
	        },
		    {
		        name: 'bomb',
		        longName: 'Bomb',
		        collectables: [{ numChests: 1 }],
		    },
	    ],
	},
	{
	    coords: [-1717,527],
	    name: 'thievesHut',
	    longName: 'Thieves Hut',
	    areas: [
	        {
	            name: 'main',
	            longName: 'Main',
	            collectables: [{ numChests: 4 }],
	        },
		    {
		        name: 'bomb',
		        longName: 'Bomb',
		        collectables: [{ numChests: 1 }],
		    },
	    ],
	},
	{
	    coords: [-592,3504],
	    name: 'paradoxCave',
	    longName: 'Paradox Cave',
	    areas: [
		    {
		        name: 'top',
		        longName: 'Top',
		        collectables: [{ numChests: 5 }],
		    },
	    ],
	},
	{
		coords: [-880,3535],
		name: 'paradoxCave',
		longName: 'Paradox Cave',
		areas: [
			{
				name: 'bottom',
				longName: 'Bottom',
				collectables: [{ numChests: 2 }],
			},
		],
	},
	{
	    coords: [-1200,1600],
	    name: 'bonkRocks',
	    longName: 'Bonk Rocks',
	    areas: [
	        {
	            name: 'cave',
	            longName: 'Cave',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
	    coords: [-3845,2670],
	    name: 'miniMoldorm',
	    longName: 'Mini-Moldorm',
	    areas: [
	        {
	            name: 'cave',
	            longName: 'Cave',
	            collectables: [{ numChests: 5 }],
	        },
	    ],
	},
	{
	    coords: [-3157,3663],
	    name: 'iceRodCave',
	    longName: 'Ice Rod Cave',
	    areas: [
	        {
	            name: 'cave',
	            longName: 'Cave',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
	    coords: [-1900,390],
	    name: 'bottleVendor',
	    longName: 'Bottle Vendor',
	    areas: [
	        {
	            name: 'vendor',
	            longName: 'Vendor',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
	    coords: [-2200,640],
	    name: 'sickKid',
	    longName: 'Sick Kid',
	    areas: [
	        {
	            name: 'byTheBed',
	            longName: 'By The Bed',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
	    coords: [-3690,1380],
	    name: 'purpleChest',
	    longName: 'Purple Chest',
	    areas: [
	        {
	            name: 'showToGary',
	            longName: 'Show to Gary',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
	    coords: [-2850,2900],
	    name: 'hobo',
	    longName: 'Hobo',
	    areas: [
	        {
	            name: 'underTheBridge',
	            longName: 'Under the Bridge',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
	    coords: [-75,1720],
	    name: 'etherTablet',
	    longName: 'Ether Tablet',
	    areas: [
	        {
	            name: 'tablet',
	            longName: 'Tablet',
	            collectables: [{ numChests: 1 }],
		        canBeViewable: true,
	        },
	    ],
	},
	{
	    coords: [-3770,895],
	    name: 'bombosTablet',
	    longName: 'Bombos Tablet',
	    areas: [
	        {
	            name: 'tablet',
	            longName: 'Tablet',
	            collectables: [{ numChests: 1 }],
		        canBeViewable: true,
	        },
	    ],
	},
];
let z3DwLocationsData = [
	{
		coords: [-2390,448],
		name: 'bombableShack',
		longName: 'Bombable Shack',
		areas: [
			{
				name: 'downstairs',
				longName: 'Downstairs',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
	    coords: [-1976,848],
	    name: 'cShapedHouse',
	    longName: 'C-Shaped House',
	    areas: [
	        {
	        	name: 'house',
	            longName: 'House',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
	    coords: [-3277,160],
	    name: 'mireShack',
	    longName: 'Mire Shack',
	    areas: [
	        {
	        	name: 'shack',
	            longName: 'Shack',
	            collectables: [{ numChests: 2 }],
	        },
	    ],
	},
	{
	    coords: [-257,3520],
	    name: 'superBunnyCave',
	    longName: 'Super-Bunny Cave',
	    areas: [
	        {
	        	name: 'cave',
	            longName: 'Cave',
	            collectables: [{ numChests: 2 }],
	        },
	    ],
	},
	{
	    coords: [-592,2352],
	    name: 'spikeCave',
	    longName: 'Spike Cave',
	    areas: [
	        {
	        	name: 'cave',
	            longName: 'Cave',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
	    coords: [-3188,2447],
	    name: 'hypeCave',
	    longName: 'Hype Cave',
	    areas: [
	        {
	            name: 'cave',
	            longName: 'Cave',
	            collectables: [{ numChests: 5 }],
	        },
	    ],
	},
	{
	    coords: [-271,3407],
	    name: 'hookshotCave',
	    longName: 'Hookshot Cave',
	    areas: [
	        {
	            name: 'front',
	            longName: 'Front',
	            collectables: [{ numChests: 1 }],
	        },
		    {
		        name: 'back',
		        longName: 'Back',
		        collectables: [{ numChests: 3 }],
		    },
	    ],
	},
	{
	    coords: [-2843,230],
	    name: 'diggingGame',
	    longName: 'Digging Game',
	    areas: [
	        {
	            name: 'digForTreasure',
	            longName: 'Dig For Treasure',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
	{
	    coords: [-2797,1263],
	    name: 'hauntedGrove',
	    longName: 'Haunted Grove',
	    areas: [
	        {
	            name: 'stumpy',
	            longName: 'Stumpy',
	            collectables: [{ numChests: 1 }],
	        },
	    ],
	},
];
z3LwLocationsData = z3LwLocationsData.map(loc => {
	return Object.assign(loc, {
		game: 'zelda3',
		map: 'zelda3-lw',
	});
});
z3DwLocationsData = z3DwLocationsData.map(loc => {
	return Object.assign(loc, {
		game: 'zelda3',
		map: 'zelda3-dw',
	});
});
const locationsData = z3LwLocationsData.concat(z3DwLocationsData);

export {
	gamesData,
	locationsData,
}
