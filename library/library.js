/**
 * Created by velten on 13.04.16.
 */
"use strict";

global.Intl = require('./i18n')(config.locale);
global.ServerError = require('./logManagement').ServerError;
global.ServerLog = require('./logManagement').ServerLog;
global.RequestError = require('./logManagement').RequestError;
//global.Promise = require('bluebird');

module.exports = {
	streamToPromise(stream, errorEventName, endEventName) {
		errorEventName = errorEventName || 'error';
		endEventName = endEventName || 'end';
		return new Promise(function(resolve, reject) {
			stream.on(errorEventName, reject);
			stream.on(endEventName, resolve);
		});
	}
};