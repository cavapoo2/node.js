const AWS = require('aws-sdk');
const fs = require('fs');
AWS.config.loadFromPath('./config.json');

const S3 = new AWS.S3({
	params: {
		Bucket: 'somebacketgavnor'
	}
});

fs.stat("./monero.jpg", (err, stat) => {

	let s3Obj = {
		Key				: 'demos/putObject/monero.jpg',
		Body			: fs.createReadStream("./monero.jpg"),
		ContentLength	: stat.size,
		ContentType		: "image/jpeg",
		ACL				: "public-read"
	};
	
	S3.putObject(s3Obj, (err, data) => {
		if(err) {
			throw err;
		}
		console.log(data);
	});
});
