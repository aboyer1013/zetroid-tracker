const moveFile = require('move-file');
const path = require('path');
const _ = require('lodash');

(async () => {
	const workingDir = path.join(__dirname, 'public/img/map/lw/');
	const sourcePath = path.join(workingDir, '0');
	const destPath = path.join(workingDir, '0');
	const numCols = 16;
	let index = 0;
	const pad = num => _.padStart(num.toString(), 3, '0');
	const collection = [];

	_.times(304, i => collection.push(i));
	for (index of collection) {
		console.log(
			path.join(sourcePath, `zelda3-lw_${pad(index)}.png`), ' | ',
			path.join(destPath, (index % numCols).toString(), `${index % numCols}.png`));
		// await moveFile(
		// 	path.join(sourcePath, `zelda3-lw_${pad(index)}.png`),
		// 	path.join(destPath, (index % numCols).toString(), `zelda3-lw_${pad(index)}.png`),
		// );
	}

})();