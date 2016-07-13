var EMBEDLY_KEY = process.env.EMBEDLY_KEY;

var embedly = require('embedly');

var api = new embedly({key: EMBEDLY_KEY});

module.exports = api;