let events = require('events');
let extend = require('extend');


let proto = {};


let emitter = new events.EventEmitter();

module.exports = function Connection(conn) {
	if (!this) return new Connection(conn);
	extend(this.__proto__,proto);
	this.__conn = conn;
	this.__conn.on('data',function(data) {
		emitter.emit('data',data.toString());
	});
}

proto.whenEnd = function whenEnd() {
	let _this = this;
	return new Promise(function(fulfill,reject) {
		_this.conn.on('end',fulfill);
	});
};

proto.getData = function getData() {
	return new Promise(function(fulfill,reject) {
		emitter.on('data',fulfill);
	});
};