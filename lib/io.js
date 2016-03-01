var io = require('socket.io')();
var state = require('../lib/state');
var os = require('os');

io.on('connection', function (socket) {
	console.log("New Admin client connected");
	io.emit("state", state.current);

	function sendCpu() {
		io.emit("cpu", os.loadavg()[0].toFixed(1).toString() + " %");
	};

	sendCpu();
	setInterval(sendCpu, 5000);
});

module.exports = io;