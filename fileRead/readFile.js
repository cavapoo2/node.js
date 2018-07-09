'use strict';
const fs = require('fs');
const showFile = (file) => {
	if(fs.existsSync(file)) {
		fs.createReadStream(file)
		.pipe(process.stdout)
		.on('close', () => {console.log('Done.');})
		.on('error', (error) => {console.log(error);});
	}
	else
	{
		console.log(`Could not obtain file ${file}`);
	}
		


}
const args = process.argv.slice(2);
args.forEach((file) => {
	showFile(file);
});
