// Accessing the filesystem
var fs = require('fs');

// Router and middleware
var express = require('express');
var app = express();

// Parsing the JSON contents
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Rendering the DOM with Jade
app.set('views', './views');
app.set('view engine', 'jade');

// Using express, serve static files such as images and JS files from the Node server
app.use(express.static('public'));

// This is the data structure that drives the graphics generator. Pretty simple, will auto generate corresponding admin page.
var data_structure = {
	widgets: {
		clock: {
			Visible: "boolean",
			Offset: "number"
		},
		lowerThird: {
			Visible: "boolean",
			Name: "text",
			Title: "text",
			Company: "text"
		}
	}
};

// File that stores the user entered data for persistance
var data_file = 'data.json';

// Router starts here
app.get('/data.json', function (req, res) {
	// This allows a locally loaded file to access the data served by Node JS even when not on the same server
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	// We always read the file from disk for persistance
	fs.readFile(data_file, function(err, data) {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		res.header('Cache-Control', 'no-cache');
		res.json(JSON.parse(data));
	});
});

// Serve the admin page with Jade
app.get('/admin', function (req, res) {
	fs.readFile(data_file, function(err, data) {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		res.locals.data = JSON.parse(data);
		res.render('admin', data_structure);
	});
});

// Process post requests and save the JSON file with user entered data back to disk.
app.post('/admin/set', function(req, res) {
	fs.writeFile(data_file, JSON.stringify(req.body), function(err) {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		res.setHeader('Cache-Control', 'no-cache');
		res.statusCode = 200;
		res.redirect("/admin");
		res.end();
	});
});

// Start the server
var server = app.listen(27015, function () {
	console.log("Server running on port 27015");
});

// That's it. Probably could be much better than this but it's a pretty good start!