module.exports = {
	globals: {
		// JS: path.resolve(webRoot, 'src/main/resources/public/js'),
		// __TESTS__: path.resolve(webRoot, 'test/resources/__tests__'),
	},
	moduleFileExtensions: ['js', 'jsx'],
	moduleNameMapper: {
		// Order matters! More specific patterns go towards the top.
		'~(.*)$': '<rootDir>/src$1',
	},
	modulePaths: [
		'<rootDir>/src',
		'node_modules',
	],
	roots: ['<rootDir>/src'],
	testURL: 'http://localhost',
	// transform: {
	// 	'^.+\\.jsx?$': 'babel-jest'
	// },
	// testResultsProcessor: 'jest-junit-reporter',
};
