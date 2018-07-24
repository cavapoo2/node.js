const fs = require('fs');
const AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

const S3 = new AWS.S3({
	params: {
		Bucket: 'somebacketgavnor'
	}
});

let outFile = fs.createWriteStream('./fetchedfile.jpg');

S3.getObject({
	Key	: 'demos/putObject/testimage.jpg'
})
.on('httpData', chunk =>  outFile.write(chunk))
.on('httpDone', () => outFile.end())
.send();
