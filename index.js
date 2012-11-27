var _ = require('underscore'),
	minify = require('clean-css'),
	express = require('express'),
	app = express();

app.use(express.bodyParser());

// Simple logger
app.use(function (request, response, next) {
	console.log('%s %s', request.method, request.url);
	next();
});

// Handle uncaughtException
process.on('uncaughtException', function (error) {
	exit('Error: ' + error.message);
});

var exit = function (message) {
	if (message) {
		console.log(message);
	}
	console.log('Exiting...');
	process.exit(1);
};

app.options('/', function (request, response) {

	// CORS support
	response.set('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Methods', 'OPTIONS,POST');
	response.set('Access-Control-Allow-Headers', 'Content-Type');

	// The block definition
	response.send({
		name: "Minify CSS",
		description: "Compresses and minifies CSS.",
		inputs: [{
			name: "css",
			type: "string",
			description: "CSS content."
		}],
		outputs: [{
			name: "minified",
			type: "string",
			description: "Minified CSS."
		}]
	});
});

app.post('/', function (request, response) {

	if (!_.has(request.body, 'inputs') && isArray(request.body.inputs)) {
		exit('WebPipe "input" is missing or formatted incorrectly.');
	}

	var inputs = request.body.inputs[0];
	var outputs = {
		outputs: []
	};
	
	// Verify POST keys exist
	if (!_.has(inputs, 'css')) {
		exit('Input is missing required "css" content.');
	}
	var minified = minify.process(inputs.css);
	if (!minified) {
		console.log('Failed to copmress CSS.');
		response.send(500);
	} else {
		outputs.outputs.push({
			minified: minified
		});
		response.json(outputs);
	}
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Listening on ' + port);
});