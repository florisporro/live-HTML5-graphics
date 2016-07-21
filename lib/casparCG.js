var CasparCG = require("caspar-cg");
var ccg = new CasparCG();

ccg.options = {
	reconnect: true,
	debug: true
};

ccg.on("connected", function () {
	console.log("Connected to CasparCG server");    
});
ccg.on("disconnected", function() {
	console.log("Disconnected from CasparCG server");
});
ccg.on("connectionError", function(err) {
	console.log("Error connecting to CasparCG server: " + err);
});

exports.server = ccg;

exports.state = { recording: false,
					streaming: false,
					preview: false }

exports.connect = function(config){
	console.log("Connecting to: " + config.server_IP + ":5250");
	ccg.connect(config.server_IP, 5250, function(){
		ccg.info(function (err, serverInfo) {
			console.log(serverInfo);
	    });
	});
}

exports.reset = function(){
	ccg.clear(1, function(){
		ccg.sendCommand('SET 1 MODE '+config.resolution);
		ccg.sendCommand('CG 1 ADD 20 GRAPHICS_RENDER 1');
		ccg.sendCommand('PLAY 1-10 DECKLINK DEVICE 1 FORMAT '+config.resolution+' embedded_audio');
	});
}

exports.preview = function(state){
	switch(state){
		case 'on':
			if (!exports.state.preview) {
				ccg.sendCommand('ADD 1 SCREEN');
				exports.state.preview = true;
			}
		break;
		case 'off':
			if (exports.state.preview) {
				ccg.sendCommand('REMOVE 1 SCREEN');
				exports.state.preview = false;
			}
		break;
	}
}

exports.streaming = function(config, state){
	switch(state){
		case 'on':
			// if (!exports.state.streaming) {
				ccg.sendCommand('ADD 1 STREAM "' + config.primaryserver + '/' + config.streamname + '" -vcodec libx264 -x264opts keyint=25 -ar 44100 -tune zerolatency -preset veryfast -b:v ' + config.bitrate + ' -vf format=pix_fmts=yuv420p -format flv');
				exports.state.streaming = true;
			// }		
		break;
		case 'off':
			// if (exports.state.streaming) {
				ccg.sendCommand('REMOVE 1 STREAM');
				exports.state.streaming = false;
			// } 
		break;
	}
}

// <args></args>

module.exports = exports;