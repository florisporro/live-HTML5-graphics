var io = require('socket.io')();
var state = require('../lib/state');
var os = require('os');
var casparCG = require("../lib/casparCG");

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
	function sendConnectedAdapters() {
		io.emit("clients", Object.keys(io.sockets.connected).length);
	}
	
	casparCG.server.on("connected", function () {
	    io.emit("casparCG", true);
	});
	casparCG.server.on("disconnected", function() {
		io.emit("casparCG", false);
	});

	setInterval(function(){
		sendInternet();
		sendCPU();
		sendConnectedAdapters();
	}, 1000);
});

module.exports = io;