var express = require('express');
var fs = require('fs');
var router = express.Router();

var io = require("../lib/io");
var state = require("../lib/state");

var lowerThirds = require('../models/lowerthirds');
var clock = require('../models/clock');
var logo = require('../models/logo');
var schedule = require('../models/schedule');
var geo = require('../models/geo');
var twitter = require('../models/twitter');
var broadcastMessage = require('../models/broadcastmessage');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/admin/general');
});

// File that stores the user entered data for persistance
var data_file = 'data.json';

router.get('/admin', function(req, res) {
	res.redirect("/admin/general");
});

// Serve the admin page with Jade
router.get('/admin/general', function (req, res) {
	res.locals.data = state.current;
	res.render('general', { title: 'General' });
});

// Process post requests and save the JSON file with user entered data back to disk.
router.post('/admin/:widget/set', function(req, res) {
	new_state = state.current;
	new_state[req.params.widget] = req.body;
	if (state.update(new_state)) {
		res.status = 200;
		res.redirect("/admin/general");
	}
});

router.get('/admin/:widget/show', function(req, res){
	if (state.change(req.params.widget, 'visibility', true)) {
		res.status = 200;
		res.end();
	}
});

router.get('/admin/:widget/hide', function(req, res){
	if (state.change(req.params.widget, 'visibility', false)) {
		res.status = 200;
		res.end();
	}
});

router.get('/admin/lowerThirds/', lowerThirds.index);
router.get('/admin/geo/', geo.index);
router.get('/admin/logo/', logo.index);
router.get('/admin/schedule/', schedule.index);
router.get('/admin/clock/', clock.index);
router.get('/admin/twitter/', twitter.index);
router.get('/admin/broadcastMessage/', broadcastMessage.index);

module.exports = router;