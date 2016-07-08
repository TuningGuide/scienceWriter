/**
 * Created by velten on 11.04.16.
 */

module.exports = {
	ServerLog(msg) {
		console.log.apply(console, arguments);
	},
	/**
	 * @return false if error handler did not had to be active
	 */
	ServerError(err, stderr) {
		if(!err && !stderr) {
			return false; // no error found
		}
		else {
			console.error.apply(console, arguments);
			console.error(err.stack);
			process.abort();
		}
		return true; // error handled = true
	},
	RequestError(response) {
		return function HandleErrorMessage(err, stderr) {
			var e = ServerError(err, stderr);
			if(e) {
				response.status(500).end(''+err+stderr);
			}
			return e;
		}
	}
}