module.exports = function compose(middlewares) {
	return function* (next) {
		if (!next) next = noop();
		let i =middlewares.length;
		while (i--)
			next = middlewares[i].call(this,next);
	};
};

function* noop() {}