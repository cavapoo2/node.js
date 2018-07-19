const SServer = require('ws').Server;
const socketServer = new SServer({port: 2113});

socketServer.on('connection', socket => {
	console.log('worker connection');
	let lastM = null;
	let kill = () => {
    	lastM && process.send({
			kill : lastM.id
		});
	};
	socket.on('message', message => {
		console.log('worker recieve message');
    	lastM = JSON.parse(message);
		process.send(lastM);
    });
    
    socket.on('close', kill);
    socket.on('error', kill);
});



