const amqp = require('amqp');
//const consumer = amqp.createConnection({ host: 'localhost', port: 5672 });
const c = { host: 'some_ip'
, port: 5672
, login: 'user'
, password: 'password'
, connectionTimeout: 10000
, authMechanism: 'AMQPLAIN'
, vhost: '/'
, noDelay: true
, ssl: { enabled : false
       }
}
const consumer = amqp.createConnection(c);
consumer.on('error', err => {
    console.log(err);
});


consumer.on('ready', () => {
    let exchange = consumer.exchange('node-topic-exchange', {type: "topic"});
    consumer.queue('node-topic-queue', q => {

        q.bind(exchange, '#');

        q.subscribe(message => {
            // Messages are buffers
            console.log(message.data.toString('utf8'));
        });
    });
});
