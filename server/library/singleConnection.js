/**
 * Created by velten on 17.04.16.
 */
exports.Promise = Promise;

function SingleConnectioner(opts) {
	this.opts = opts;
	this.promise = null;
}

SingleConnectioner.prototype.acquire = function (callback) {
	if(this.promise) return this.promise.then(callback);
	this.promise = exports.Promise.resolve(this.opts.create());
	return this.promise.then(callback);
};

SingleConnectioner.prototype.destroy = function () {
	if(this.promise) {
		var promise = this.promise;
		this.promise = null;
		return promise.then(this.opts.destroy);
	}
	return exports.Promise.resolve(0);
};

SingleConnectioner.prototype.drain = function () {
	return this.destroy();
};

exports.create = function createConnectioner(opts){
	return new SingleConnectioner(opts);
};
