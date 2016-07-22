var fs = require('fs');
var io = require("../lib/io");

try {
	exports.current = JSON.parse(fs.readFileSync('data.json'));
}
catch (e) {
    console.log("Could not find data.json, creating file");
    fs.writeFileSync('data.json', '{"general":{},"casparCG":{},"clock":{},"countdown":{},"broadcastMessage":{},"lowerThirds":{},"logo":{},"geo":{},"schedule":{},"twitter":{}}');
    exports.current = JSON.parse(fs.readFileSync('data.json'));
}

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

exports.add_entry = function(widget, entry) {
	new_state = exports.current;

	if(!new_state[widget].entries) {
		new_state[widget].entries = [];
	}
	new_state[widget].entries.push(entry);

	updateState(new_state);
	return true;
}
exports.delete_entry = function(widget, id) {
	new_state = exports.current;

	new_state[widget].entries.splice(id,1);
	updateState(new_state);
	return true;
}
// exports.update_entry = function(widget, id, entry) {

// }

module.exports = exports;