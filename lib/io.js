var io = require('socket.io')();
var state = require('../lib/state');
var os = require('os');

function checkInternet(cb) {
    require('dns').lookup('google.com',function(err) {
        if (err && err.code == "ENOTFOUND") {
            cb(false);
        } else {
            cb(true);
        }
    })
}

io.on('connection', function (socket) {
	console.log("New Admin client connected");
	io.emit("state", state.current);

	function sendCPU() {
		io.emit("cpu", os.loadavg()[0].toFixed(1).toString() + " %");
	};
	function sendInternet() {
		checkInternet(function(isConnected) {
			io.emit("internet", isConnected);
		});
	}

	sendInternet();
	sendCPU();
	setInterval(sendCPU, 5000);
	setInterval(sendInternet, 60000);
});

module.exports = io;