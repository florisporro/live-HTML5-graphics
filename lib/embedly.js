var EMBEDLY_KEY = 'd7d206c16c3c48889b75ceada67e5990';

var embedly = require('embedly');

var api = new embedly({key: EMBEDLY_KEY});

module.exports = api;