const fs = require('fs');
const http = require('http');
const AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

const S3 = new AWS.S3({
	params: {
		Bucket: 'somebacketgavnor'
	}
});

S3.deleteObjects({
	Bucket	: 'somebacketgavnor',
	Delete	: {
		Objects	: [
			{
				Key	: 'demos/putObject/first.json'
			},
			{
				Key	: 'demos/putObject/testimage.jpg'
			}
			//	...
		]
	}
}, (err, data) => { 
	//	...
});
