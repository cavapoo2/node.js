'use strict';
const dgram = require('dgram');
const socket = dgram.createSocket({type:'udp4',reuseAddr:true});
const multicastAddress = '239.1.2.3';
const multicastAddress2 = '239.3.2.1';
//const multicastAddress =  '233.255.255.255';
const multicastPort = 5554;

socket.bind(multicastPort);

socket.on("listening", function() {
    this.setMulticastTTL(64);
	this.addMembership(multicastAddress);
	this.addMembership(multicastAddress2);
});

let cnt = 1;
let sender;

(sender = () => {
	let msg = Buffer.from(`This is message #${cnt}`);
	socket.send(
		msg,
		0,
		msg.length,
		multicastPort,
		multicastAddress
	);
	socket.send(
		msg,
		0,
		msg.length,
		multicastPort,
		multicastAddress2
	);

	
	++cnt;
	
	setTimeout(sender, 1000);
})();
