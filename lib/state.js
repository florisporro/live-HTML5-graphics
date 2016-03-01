var fs = require('fs');
var io = require("../lib/io");

exports.current = JSON.parse(fs.readFileSync('data.json'));

function updateState(new_state){
	exports.current = new_state;
	fs.writeFileSync('data.json', JSON.stringify(new_state));
	io.emit('state', new_state);
}

exports.update = function(new_state){
	updateState(new_state);
	return true;
}

exports.change = function(widget, param, value) {
	new_state = exports.current;
	if(param) {
		new_state[widget][param] = value;
	} else {
		new_state[widget] = value;
	}
	updateState(new_state);
	return true;
}

module.exports = exports;