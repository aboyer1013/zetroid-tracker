const path = require('path');

// This is just so PhpStorm can follow aliased imports. Webpack is not used.
module.exports = {
	resolve: {
		extensions: ['.jsx', '.js'],
		alias: {
			'~': path.resolve(__dirname, './src'),
		},
	},
};
