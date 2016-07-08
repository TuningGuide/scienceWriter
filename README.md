# ScienceWriter
This folder contains:
* a node server (server.js) which observes changes in 'output' folder and keeps it in sync with git
* a editor.html and index.html to serve

## Instalation
* First you need npm and nodejs https://docs.npmjs.com/getting-started/installing-node
* Then install express etc. listed in package.json via npm install
* then create a config.js like:

```javascript
const config = {
	development: {
		ssh: {
			host: 'login.zedat.fu-berlin.de',
			port: 22,
			path: 'public_html/Masterarbeit',
			user: 'velten'
		},
		git: {
			pushUrl: 'git@gitlab.plista.com:vh/ma.git'
		}
	},

	staging: {
		...
	},

	production: {
		...
	}
};

const active = config[process.env.NODE_ENV || 'development'];
active.availableConfigEnvironments = config;

module.exports = active;
```
