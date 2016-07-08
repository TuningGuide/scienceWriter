const program = require("commander");
const path = require("path");
const fs = require('fs');
const simpleGit = require('simple-git');
const rSync = require('rsync');

const http = require('http');
const https = require('https');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const library = require("./library/library"); // defines things like ServerError, ServerLog, SingleConnection ...
const config = require("./config");

var outputPath = path.join(__dirname, 'output');
var contentPath = path.join(outputPath, 'content.html');
var versionPath = path.join(outputPath, 'version.json');
var outputFolderCreated = false;
var gitFolderInitialised = false;

program
	.version('0.0.1')
	.option('-p, --port [port_number]', 'set web server port (8888)', '8888')
	.parse(process.argv);

// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// Deliver static files from folder
app.use(express.static(__dirname));

var gitRepo = simpleGit(outputPath);
gitRepo.outputHandler(function (command, stdout, stderr) {
	stdout.pipe(process.stdout);
	stderr.pipe(process.stderr);
});

var rsync = new rSync()
	.shell('ssh')
	.recursive().compress().delete()
	.exclude(['.git', '.DS_Store'])
	.source(outputPath)
	.destination(config.ssh.user + '@' + config.ssh.host + ':' + config.ssh.path);

app.post('/output/content.html', function (request, response) {
	var errorHandler = RequestError(response);
	var content = request.body.content;

	if (outputFolderCreated) {
		if (content == "") {
			errorHandler("Content was empty. Did not save");
		}
		fs.writeFile(contentPath, content, function (err) {
			if (ServerError(err)) {
				return;
			}

			if (gitFolderInitialised) {
				var message = '';
				gitRepo
					.add('.')
					.commit('save content')
					.push('origin', 'master');

				response.end('saved');

				gitRepo
				// do not output full log history on server stdout
					.outputHandler(function (command, stdout, stderr) {})
					.log(['--oneline'], function (err, log) {
						if (!ServerError(err)) {
							var data = JSON.stringify({version: log.total, hash: log.latest.hash.split(' ', 1)[0]});
							fs.writeFile(versionPath, data, function (err) {
								ServerError(err);
							});
						}
					});
			}
			else {
				errorHandler('Could not commit content as git was not initialised (yet)!');
			}

			rsync.execute(function (err, code, cmd) {
				ServerError(err);
				ServerLog(cmd + ': ' + code);
			});
		});
	}
	else {
		errorHandler('Could not save content as output folder was not created (yet)!');
	}
});

var server = http.createServer(app).listen(program.port, function () {
	var host = server.address().address;
	var port = server.address().port;

	ServerLog('Server listening at ', host, port);
	ServerLog('CTRL + C to shutdown.');
});
//https.createServer({ ... }, app).listen(443);

// git update -------------
var outputFolderCallback = function (err) {
	if (ServerError(err)) {
		return;
	}

	// touch content file
	fs.open(contentPath, "a", function (err, fd) {
		ServerError(err);
		fs.close(fd, ServerError);
	});
	fs.open(versionPath, "a", function (err, fd) {
		ServerError(err);
		fs.close(fd, ServerError);
	});

	outputFolderCreated = true;

	// check if .git folder exists if not do git init
	fs.mkdir(path.join(outputPath, '.git'), function (err) {
		if (!err) {
			gitRepo.init();
			gitRepo.addRemote('origin', pushUrl);
		}
		gitFolderInitialised = true;
	});
};

fs.mkdir(outputPath, function (err) {
	if (err) {
		if (err.code == 'EEXIST') outputFolderCallback(null); // ignore the error if the folder already exists
		else outputFolderCallback(err); // something else went wrong
	} else outputFolderCallback(null); // successfully created folder
});