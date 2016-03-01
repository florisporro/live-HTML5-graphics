var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var io = require("../lib/io");
exports.emitter = new EventEmitter();

exports.current = JSON.parse(fs.readFileSync('data.json'));

exports.update = function(new_state){
	exports.current = new_state;
	fs.writeFileSync('data.json', JSON.stringify(new_state));
	io.emit('state', new_state);
	return true;
}

module.exports = exports;