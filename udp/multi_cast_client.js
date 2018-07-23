'use strict';
const dgram = require('dgram');
const socket = dgram.createSocket({type:'udp4',reuseAddr:true});
const multicastAddress = '239.1.2.3';
//const multicastAddress =  '233.255.255.255';
const multicastPort = 5554;
const multicast2Address = '239.3.2.1';

dgram.createSocket({type:'udp4',reuseAddr:true})
.on('message', (message, remote) => {
    console.log(`Client1 received message ${message} from ${remote.address}:${remote.port}`);
})
.bind(multicastPort, multicastAddress);

dgram.createSocket({type:'udp4',reuseAddr:true})
.on('message', (message, remote) => {
	console.log(`Client2 received message ${message} from ${remote.address}:${remote.port}`);
})
.bind(multicastPort, multicastAddress);

dgram.createSocket({type:'udp4',reuseAddr:true})
.on('message', (message, remote) => {
	console.log(`Client3 received message ${message} from ${remote.address}:${remote.port}`);
	let msg = Buffer.from('Calling other clients!','utf8');
	socket.send(msg,0,msg.length,multicastPort,multicastAddress);
})
.bind(multicastPort, multicast2Address);
