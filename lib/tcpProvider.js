let net = require('net');
let events = require('events');
let extend = require('extend');
let Connection = require('./tcpConnection');


let proto = {};


let emitter = new events.EventEmitter();

module.exports = function TcpProvider(port) {
	if (!this) return new TcpProvider(port,host);
	extend(this.__proto__,proto);
	this.__server = net.createServer(function(connection) {
		emitter.emit('conn',connection);
	}).listen(port);
};


proto.getConnection = function getConnection() {
	return new Promise(function(fulfill,reject) {
		emitter.once('conn',function(conn) {
			console.log('new connection');
			fulfill(new Connection(conn));
		});
	});
};
