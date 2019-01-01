const path = require('path');
// const webRoot = path.resolve(__dirname);

module.exports = {
	testURL: 'http://localhost',
	roots: [
		'<rootDir>/src',
	],
	// transform: {
	// 	'^.+\\.jsx?$': 'babel-jest'
	// },
	// testResultsProcessor: 'jest-junit-reporter',
	moduleFileExtensions: [
		'js',
		'jsx'
	],
	modulePaths: [
		'<rootDir>/src',
		'node_modules'
	],
	moduleNameMapper: {
		// Order matters! More specific patterns go towards the top.
		'~(.*)$': '<rootDir>/src$1'
	},
	globals: {
		// JS: path.resolve(webRoot, 'src/main/resources/public/js'),
		// __TESTS__: path.resolve(webRoot, 'test/resources/__tests__'),
	},
}