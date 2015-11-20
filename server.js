var express = require('express');
var app = express();

app.get('/graphics.json', function (req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.send('{ "clock": { "visible": true } }');
});

var server = app.listen(27015, function () {
});