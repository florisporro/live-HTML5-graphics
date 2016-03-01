var io = require('socket.io')();
var state = require('../lib/state')

io.on('connection', function (socket) {
	console.log("New Admin client connected");
	io.emit("state", state.current);
});

module.exports = io;