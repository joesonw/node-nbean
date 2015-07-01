

let proto = Connection.prototype;

module.exports = Connection;

function Connection(conn,fn,onerror) {
	if (!(this instanceof Connection)) return new Connection(conn,fn,onerror);
	this.conn = conn;
	this.fn = fn;
	this.conn.on('data',this.ondata());
	this.onerror = onerror;
	this.breakError  =  new Error('__$$BREAK$$__');
	this.buffer = '';
	let self = this;
	this.break = function() {
		throw self.breakError;
	}
}

proto.ondata= function() {
	let self = this;
	return function(buffer) {
		self.buffer = self.buffer + buffer.toString();
		self.fn.call(self).catch(function(err) {
			if (err == self.breakError) {
				// break from middleware execution loops
			} else {
				self.buffer = '';
				self.onerror(err);
			}
		});
	};
};

proto.send = function (buffer) {
	this.conn.write(buffer);
};