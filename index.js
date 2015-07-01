var Server = require('./lib/server.js');
var redis = require('redis');
var nbeanPacket = require('nbean-packet')({
	maxLength:255
});

var nbeanDirectory = require('nbean-directory');

var server=Server();

server.once(function* (next) {
	console.log('new connection');
	yield next;
});

server.use(nbeanPacket.unpack);
server.use(nbeanDirectory({
	redis:redis.createClient()
}));

server.use(function* () {
	console.log('msg',this.packet);
	//this.send('hello world');
});


server.listen(8888);
