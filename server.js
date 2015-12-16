// Accessing the filesystem
var fs = require('fs');

// Router and middleware
var express = require('express');
var app = express();

// Start the server
var server = app.listen(27015, function () {
	console.log("Server running on port 27015");
});

// Socket.io to push changes to render clients dynamically
var io = require('socket.io')(server);
io.serveClient(false);

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

io.on('connection', function (socket) {
  fs.readFile(data_file, function(err, data) {
  	if (err) {
  		console.error(err);
  		process.exit(1);
  	}
  	socket.emit('newData', JSON.parse(data));
  });
});

// Serve the admin page with Jade
app.get('/admin', function (req, res) {
	// Get the current config from the file so we can pre-populate the form
	fs.readFile(data_file, function(err, data) {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		// Send the data long to the render engine
		res.locals.data = JSON.parse(data);
		// Render the forms with the data structure defined above
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
		// Emit the new data to all connected render clients
		io.emit('newData', req.body);

		res.setHeader('Cache-Control', 'no-cache');
		res.statusCode = 200;
		res.redirect("/admin");
		res.end();
	});
});

// That's it. Probably could be much better than this but it's a pretty good start!