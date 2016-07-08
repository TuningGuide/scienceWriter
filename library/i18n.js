/**
 * Created by velten on 20.04.16.
 */
var areIntlLocalesSupported = require('intl-locales-supported');

module.exports = function (locale) {
	if (global.Intl) {
		// Determine if the built-in `Intl` has the locale data we need.
		if (!areIntlLocalesSupported([config.locale])) {
			// `Intl` exists, but it doesn't have the data we need, so load the
			// polyfill and replace the constructors we need with the polyfill's.
			require('intl');
			Intl.NumberFormat   = IntlPolyfill.NumberFormat;
			Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

			Number.prototype.toLocaleString = function(locale) {
				return new Intl.NumberFormat(locale||config.locale).format(this);
			};
			Date.prototype.toLocaleString = function(locale) {
				options = {
					year: 'numeric', month: 'numeric', day: 'numeric',
					hour: 'numeric', minute: 'numeric', second: 'numeric'
				};
				return new Intl.DateTimeFormat(locale||config.locale, options).format(this);
			};
			Date.prototype.toLocaleDateString = function(locale) {
				return new Intl.DateTimeFormat(locale||config.locale).format(this);
			};

			return Intl;
		}
	} else {
		// No `Intl`, so use and load the polyfill.
		return require('intl');
	}
};