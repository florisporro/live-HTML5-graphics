var io = require('socket.io')();
var state = require('../lib/state');
var os = require('os');
var cpu = require('windows-cpu');
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
		switch(os.platform()){
			case 'darwin':
				io.emit("cpu", os.loadavg()[0].toFixed(1).toString() + " %");
				break;
			case 'linux':
				io.emit("cpu", os.loadavg()[0].toFixed(1).toString() + " %");
				break;
			case 'win32':
				cpu.totalLoad(function(error, results) {
					if(error) {
						return console.log(error);
					}
					io.emit("cpu", results[0].toFixed(1).toString() + " %");
				});
				break;
		}
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