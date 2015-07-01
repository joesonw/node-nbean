let net 		= require('net');
let co 			= require('co');
let compose 	= require('koa-compose');
let Emitter    	= require('events').EventEmitter;
let Connection	= require('./connection');

let proto 		=  Server.prototype;

module.exports 	= Server;

function Server() {
	if (!(this instanceof Server)) return new Server();
	this.middlewares = [];
	this.connectionMiddlewares = [];

}

Object.setPrototypeOf(Server.prototype,Emitter.prototype);

proto.listen = function() {
	let server = net.createServer(this.callback());
	return server.listen.apply(server,arguments);
};

proto.use = function(fn) {
	if (!fn || 'GeneratorFunction' !== fn.constructor.name) throw new Error('middlewares can only be generator functions');
	this.middlewares.push(fn);
	return this;
};

proto.once = function(fn) {
	if (!fn || 'GeneratorFunction' !== fn.constructor.name) throw new Error('middlewares can only be generator functions');
	this.connectionMiddlewares.push(fn);
	return this;
};

proto.callback = function() {
	let middlewares = [handler].concat(this.middlewares);
	let fn = co.wrap(compose(middlewares));

	let connectionMiddlewares = [onceHandler].concat(this.connectionMiddlewares);

	let onceFn = co.wrap(compose(connectionMiddlewares));

	if (!this.listeners('error').length) this.on('error',this.onerror);

	let self = this;
	return function(conn) {
		let c = Connection(conn,fn,self.onerror);
		onceFn.call(c).catch(self.onerror);
	};
};

function* handler(next) {
	yield next;
	//if (false === this.handler) return;
}

function* onceHandler(next) {
	yield next;
}


proto.onerror = function(err) {
	console.log(err);
	let msg = err.stack || err.toString();
	console.error('Error:');
	console.error(msg);
	console.error();
};

