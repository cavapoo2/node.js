const http = require("http");
const fs = require("fs");
const url = require("url");

let UNIQUE_ID = 1;
let USER_ID	= 1e10;

let clients	= {};
let clientQMap = {};
let questions = {};
let answers	= {};

function removeClient(id) {
	if(id) {
		delete clients[id];
		delete clientQMap[id];
	}
}

http.createServer((request, response) => {

	let parsedURL = url.parse(request.url, true);
	let pathname = parsedURL.pathname;
	let args = pathname.split("/");
	console.log('server url');
	console.log(request.url);

	if(request.url === '/favicon.ico') {
		console.log('favicon');
		response.writeHead(200, {
			'Content-Type': 'image/x-icon'
		});
		return response.end();
	}


	// Lose initial null value
	args.shift();
	
	let method = args.shift();
	let parameter = decodeURIComponent(args[0]);
	console.log('server param');
	console.log(parameter);

	let sseUserId = request.headers['_sse_user_id_'];

	console.log('sssUserId=');
	console.log(sseUserId);
  
	function broadcast(toId, msg, eventName) {
	
		if(toId === "*") {
			for(let p in clients) {
				broadcast(p, msg);
			}
			return;
		}
	
		let clientSocket = clients[toId];
		if(!clientSocket) {
			return;
		}
	
		eventName && clientSocket.write("event: " + eventName + "\n");
		clientSocket.write("id: " + (++UNIQUE_ID) + "\n");
		console.log(UNIQUE_ID);
		clientSocket.write("data: " + JSON.stringify(msg) + "\n\n");
		console.log('sever broadcast');
		//console.log(eventName,UNIQUE_ID,JSON.stringify(msg));
	}
  
	if(method === "login") {
		console.log('login');

		response.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache"
		});
		
		response.write(":" + Array(2049).join(" ") + "\n"); // 2kB 
		response.write("retry: 2000\n");
				
		removeClient(sseUserId);
		console.log('server loging remove ssUserId');
		console.log(sseUserId);
		
		// A very simple id system. You'll need something more secure.
		sseUserId = (USER_ID++).toString(36);
		console.log('new userID');
		console.log(sseUserId);

		clients[sseUserId] = response;

		broadcast(sseUserId, sseUserId, "login");
		//		broadcast(sseUserId, sseUserId, "event");
		
		broadcast(sseUserId, {
			type		: "questions",
			questions	: questions
		});

		response.on("close", function() {
			removeClient(sseUserId);
		});
		
		// In order to keep the connection alive we send a "heartbeat" every 10 seconds.
		// https://bugzilla.mozilla.org/show_bug.cgi?id=444328
		setInterval(() => broadcast(sseUserId, new Date().getTime(), "ping"), 10000);
		
		return;
	}
	
	if(method === "askquestion") {

		// Already asked?
		if(questions[parameter]) {
			return response.end('already asked');
		}

		questions[parameter] = sseUserId;	
		
		broadcast("*", {
			type		: "questions",
			questions	: questions
		});
		
		return response.end();
	}
	
	if(method === "addanswer") {
	
		if(!parameter) {
			broadcast(sseUserId, {
				type	: "notification",
				message	: "Your answer is too short."
			});
			return response.end();
		}
	
		var curUserQuestion = clientQMap[sseUserId];
		if(!curUserQuestion) {
			broadcast(sseUserId, {
				type	: "notification",
				message	: "Please select a question to answer."
			});
			return response.end();
		}
		
		answers[curUserQuestion] = answers[curUserQuestion] || [];
		answers[curUserQuestion].push(parameter);
		
		// Tell everyone watching about this question
		for(let id in clientQMap) {
			if(clientQMap[id] === curUserQuestion) {
				broadcast(id, {
					type		: "answers",
					question	: curUserQuestion,
					answers		: answers[curUserQuestion]
				});
			}
		}
		
		return response.end();
	}
	
	if(method === "selectquestion") {
		if(parameter && questions[parameter]) {
			clientQMap[sseUserId] = parameter;
			console.log('select question');
			console.log(parameter);
			broadcast(sseUserId, {
				type		: "answers",
				question	: parameter,
				answers		: answers[parameter] ? answers[parameter] : []
			});
		}
		
		return response.end();
	}
	
	if(!method) {
		return fs.createReadStream('./index.html').pipe(response);
	} 

}).listen(2112);
