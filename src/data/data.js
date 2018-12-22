const gamesData = [
	{ name: 'zelda1', longName: 'The Legend of Zelda', },
	{ name: 'zelda3', longName: 'The Legend of Zelda: A Link to the Past' },
	{ name: 'metroid1', longName: 'Metroid' },
	{ name: 'metroid3', longName: 'Super Metroid' },
];
let locationsData = [
	{
	    coords: [-1215,2463],
	    name: 'kingsTomb',
	    longName: 'King’s Tomb',
		areas: [
			{
				longName: 'The Crypt',
				collectables: [
					{
						numChests: 1,
					},
				],
			},
		],
	},
	{
	    coords: [-3830,1920],
	    name: 'dam',
	    longName: 'Dam',
	    areas: [
	        {
	            longName: 'Inside',
	            collectables: [
	                {
	                    numChests: 1,
	                },
	            ],
	        },
		    {
		        longName: 'Outside',
		        collectables: [
		            {
		                numChests: 1,
		            },
		        ],
		    },
	    ],

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
