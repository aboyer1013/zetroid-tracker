const gamesData = [
	{ name: 'zelda1', longName: 'The Legend of Zelda' },
	{ name: 'zelda3', longName: 'The Legend of Zelda: A Link to the Past' },
	{ name: 'metroid1', longName: 'Metroid' },
	{ name: 'metroid3', longName: 'Super Metroid' },
];
let z3LwLocationsData = [
	{
		coords: [-1215, 2463],
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
		coords: [-3830, 1920],
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
		coords: [-2823, 2240],
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
		coords: [-368, 3263],
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
		coords: [-368, 3455],
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
		coords: [-2320, 655],
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
		coords: [-2390, 448],
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
		coords: [-3377, 815],
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
		coords: [-1855, 3320],
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
		coords: [-1743, 95],
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
		coords: [-1717, 527],
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
		coords: [-592, 3504],
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
		coords: [-880, 3535],
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
		coords: [-1200, 1600],
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
		coords: [-3845, 2670],
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
		coords: [-3157, 3663],
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
		coords: [-1900, 390],
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
		coords: [-2200, 640],
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
		coords: [-3690, 1380],
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
		coords: [-2850, 2900],
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
		coords: [-75, 1720],
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
		coords: [-3770, 895],
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
	{
		coords: [-520, 3920],
		name: 'zoraArea',
		longName: 'Zora Area',
		areas: [
			{
				name: 'kingZora',
				longName: 'King Zora',
				collectables: [{ numChests: 1 }],
			},
			{
				name: 'ledge',
				longName: 'Ledge',
				collectables: [{ numChests: 1 }],
				canBeViewable: true,
			},
		],
	},
	{
		coords: [-720, 1455],
		name: 'oldMan',
		longName: 'Old Man',
		areas: [
			{
				name: 'bringHimHome',
				longName: 'Bring Him Home',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-1368, 3280],
		name: 'witchsHut',
		longName: 'Witch’s Hut',
		areas: [
			{
				name: 'assistant',
				longName: 'Assistant',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-535, 775],
		name: 'forestHideout',
		longName: 'Forest Hideout',
		areas: [
			{
				name: 'hideout',
				longName: 'Hideout',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-300, 1232],
		name: 'lumberjacks',
		longName: 'Lumberjacks',
		areas: [
			{
				name: 'cave',
				longName: 'Cave',
				collectables: [{ numChests: 1 }],
				canBeViewable: true,
			},
		],
	},
	{
		coords: [-415, 2000],
		name: 'spectacleRockCave',
		longName: 'Spectacle Rock Cave',
		areas: [
			{
				name: 'cave',
				longName: 'Cave',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-3377, 1087],
		name: 'southOfGrove',
		longName: 'South of Grove',
		areas: [
			{
				name: 'circleOfBushes',
				longName: 'Circle of Bushes',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-1120, 2335],
		name: 'graveyardLedge',
		longName: 'Graveyard Ledge',
		areas: [
			{
				name: 'cave',
				longName: 'Cave',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-3183, 720],
		name: 'checkerboard',
		longName: 'Checkerboard',
		areas: [
			{
				name: 'cave',
				longName: 'Cave',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-2695, 640],
		name: 'library',
		longName: 'Library',
		areas: [
			{
				name: 'onTheShelf',
				longName: 'On the Shelf',
				collectables: [{ numChests: 1 }],
				canBeViewable: true,
			},
		],
	},
	{
		coords: [-350, 500],
		name: 'forestMushroom',
		longName: 'Forest Mushroom',
		areas: [
			{
				name: 'mushroom',
				longName: 'Mushroom',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-340, 2080],
		name: 'spectacleRock',
		longName: 'Spectacle Rock',
		areas: [
			{
				name: 'upOnTop',
				longName: 'Up On Top',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-65, 3330],
		name: 'floatingIsland',
		longName: 'Floating Island',
		areas: [
			{
				name: 'island',
				longName: 'Island',
				collectables: [{ numChests: 1 }],
				canBeViewable: true,
			},
		],
	},
	{
		coords: [-2865, 145],
		name: 'race',
		longName: 'Race',
		areas: [
			{
				name: 'minigame',
				longName: 'Mini-game',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-3730, 100],
		name: 'desertLedge',
		longName: 'Desert Ledge',
		areas: [
			{
				name: 'ledge',
				longName: 'Ledge',
				collectables: [{ numChests: 1 }],
				canBeViewable: true,
			},
		],
	},
	{
		coords: [-3405, 2960],
		name: 'lakeHyliaIsland',
		longName: 'Lake Hylia Island',
		areas: [
			{
				name: 'island',
				longName: 'Island',
				collectables: [{ numChests: 1 }],
				canBeViewable: true,
			},
		],
	},
	{
		coords: [-2695, 1205],
		name: 'digSpot',
		longName: 'Dig Spot',
		areas: [
			{
				name: 'hiddenTreasure',
				longName: 'Hidden Treasure',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-1200, 2127],
		name: 'northwestTombstone',
		longName: 'Northwest Tombstone',
		areas: [
			{
				name: 'sewerCrackedWall',
				longName: 'Sewer Cracked Wall',
				collectables: [{ numChests: 3 }],
			},
		],
	},
	{
		coords: [-1705, 2440],
		name: 'castleSecretEntrance',
		longName: 'Castle Secret Entrance',
		areas: [
			{
				name: 'uncleHallway',
				longName: 'Uncle & Hallway',
				collectables: [{ numChests: 2 }],
			},
		],
	},
	{
		coords: [-1796, 2047],
		name: 'hyruleCastle',
		longName: 'Hyrule Castle',
		areas: [
			{
				name: 'castleEntrance',
				longName: 'Castle Entrance',
				collectables: [{ numChests: 3 }],
			},
			{
				name: 'sewerDarkCross',
				longName: 'Sewer Dark Cross',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-1095, 1887],
		name: 'sanctuaryEntrance',
		longName: 'Sanctuary Entrance',
		areas: [
			{
				name: 'sanctuary',
				longName: 'Sanctuary',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-2300, 1327],
		name: 'magicBat',
		longName: 'Magic Bat',
		areas: [
			{
				name: 'magicBowl',
				longName: 'Magic Bowl',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-200, 167],
		name: 'masterSwordPedestal',
		longName: 'Master Sword Pedestal',
		areas: [
			{
				name: 'pedestal',
				longName: 'Pedestal',
				collectables: [{ numChests: 1 }],
				canBeViewable: true,
			},
		],
	},
	{
		coords: [-550, 3688],
		name: 'waterfallFairy',
		longName: 'Waterfall Fairy',
		areas: [
			{
				name: 'waterfallCave',
				longName: 'Waterfall Cave',
				collectables: [{ numChests: 2 }],
			},
		],
	},
];
let z3DwLocationsData = [
	{
		coords: [-2390, 448],
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
		coords: [-1976, 848],
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
		coords: [-3277, 160],
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
		coords: [-257, 3520],
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
		coords: [-592, 2352],
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
		coords: [-3188, 2447],
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
		coords: [-271, 3407],
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
		coords: [-2797, 1263],
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
	{
		coords: [-700, 3663],
		name: 'catfish',
		longName: 'Catfish',
		areas: [
			{
				name: 'ringOfStones',
				longName: 'Ring of Stones',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-2478, 1295],
		name: 'hammerPegs',
		longName: 'Hammer Pegs',
		areas: [
			{
				name: 'cave',
				longName: 'Cave',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-625, 1470],
		name: 'bumperCave',
		longName: 'Bumper Cave',
		areas: [
			{
				name: 'ledge',
				longName: 'Ledge',
				collectables: [{ numChests: 1 }],
				canBeViewable: true,
			},
		],
	},
	{
		coords: [-1833, 2375],
		name: 'pyramidLedge',
		longName: 'Pyramid Ledge',
		areas: [
			{
				name: 'ledge',
				longName: 'Ledge',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-2840, 232],
		name: 'diggingGame',
		longName: 'Digging Game',
		areas: [
			{
				name: 'digForTreasure',
				longName: 'Dig for Treasure',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-2715, 615],
		name: 'smiths',
		longName: 'Smiths',
		areas: [
			{
				name: 'bringHimHome',
				longName: 'Bring Him Home',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-1990, 1920],
		name: 'fatFairy',
		longName: 'Fat Fairy',
		areas: [
			{
				name: 'bigBombSpot',
				longName: 'Big Bomb Spot',
				collectables: [{ numChests: 2 }],
			},
		],
	},
	{
		coords: [-1910, 208],
		name: 'treasureChestMiniGame',
		longName: 'Treasure Chest Mini-Game',
		areas: [
			{
				name: 'prizes',
				longName: 'Prizes',
				collectables: [{ numChests: 1 }],
			},
		],
	},
	{
		coords: [-2180, 1248],
		name: 'purpleChest',
		longName: 'Purple Chest',
		areas: [
			{
				name: 'showToGary',
				longName: 'Show To Gary',
				collectables: [{ numChests: 1 }],
			},
		],
	},
];
z3LwLocationsData = z3LwLocationsData.map((loc) => {
	return Object.assign(loc, {
		game: 'zelda3',
		map: 'zelda3-lw',
	});
});
z3DwLocationsData = z3DwLocationsData.map((loc) => {
	return Object.assign(loc, {
		game: 'zelda3',
		map: 'zelda3-dw',
	});
});
const locationsData = z3LwLocationsData.concat(z3DwLocationsData);

export {
	gamesData,
	locationsData,
};
