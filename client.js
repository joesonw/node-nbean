var net = require('net');
var nbeanPacket = require('nbean-packet')({
	maxLength:255
});

var client = new net.Socket();
client.connect(8888,'127.0.0.1',function() {
	client.write(nbeanPacket.pack(JSON.stringify({
		command:'mkdir',
		name:'test',
		middleware:'nbean-directory'
	})));
	client.destroy();
});
