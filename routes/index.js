var express = require('express');
var fs = require('fs');
var router = express.Router();

var io = require("../lib/io");
var state = require("../lib/state");

// var widgets = {
// 	lowerThirds : require('../models/lowerthirds'),
// 	clock : require('../models/clock'),
// 	logo : require('../models/logo'),
// 	schedule : require('../models/schedule'),
// 	geo : require('../models/geo'),
// 	twitter : require('../models/twitter'),
// 	broadcastMessage : require('../models/broadcastmessage')
// }

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

router.get('/admin', function(req, res) {
	res.redirect("/admin/general");
});

// Serve the admin page with Jade
router.get('/admin/general', function (req, res) {
	res.locals.data = state.current;
	res.render('general', { title: 'General' });
});

router.post('/admin/:widget/set', function(req, res) {
	new_state = state.current;
	for (var param in req.body) {
		new_state[req.params.widget][param] = req.body[param];
	}
	if (state.update(new_state)) {
		res.status = 200;
		res.redirect("/admin/"+req.params.widget);
	}
});

router.post('/admin/:widget/entries/add', function(req, res) {
	if (state.add_entry(req.params.widget, req.body)) {
		res.send({ widget: req.params.widget, id: Object.keys(state.current[req.params.widget].entries).length-1, data: req.body });
		res.end();
	}
});
router.post('/admin/:widget/entries/:entry/delete', function(req, res) {
	if (state.delete_entry(req.params.widget, req.params.entry)) {
		res.status = 200;
		res.end();
	}
});
router.post('/admin/:widget/entries/:entry/update', function(req, res) {
	// if (state.update_entry(req.params.widget, req.params.entry, req.body)) {
	// 	res.send(req.body);
	// 	res.end();
	// }
});

router.get('/admin/:widget/:entry?/show/', function(req, res){
	if (state.change(req.params.widget, 'visibility', (req.params.entry != undefined ? req.params.entry : true))) {
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