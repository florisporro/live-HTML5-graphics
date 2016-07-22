"use strict"
var expect = require('chai').expect;
var request = require('superagent');
var state = require('../lib/state');
var fs = require('fs');

process.env.PORT = 8080;
process.env.NODE_ENV = 'test';
var server = require('../bin/www');;

describe('Admin panel', function(){

	var baseUrl = 'http://localhost:'+process.env.PORT;
	var widgets = ['general', 'casparCG', 'broadcastMessage', 'clock', 'countdown', 'logo', 'twitter', 'lowerThirds'];

	describe('all control panel urls return status 200', function(){
		for (let widget in widgets) {
			it(widgets[widget] + ' should return status 200', function(done){
				request.get(baseUrl + '/admin/' + widgets[widget]).end(function assert(err, res) {
					expect(err).to.not.be.ok;
					expect(res).to.have.property('status', 200);
					// expect(res.text).to.equal('test');
					done();
				});
			});
		}
	});

	describe('all control panel urls should return status 200 if no data.json file is present', function(){
		var old_state = state.current;
		before(function() {
			fs.unlinkSync('data.json');
		});

		after(function() {
			state.update(old_state);
		});

		for (let widget in widgets) {
			it(widgets[widget] + ' should return status 200', function(done){
				request.get(baseUrl + '/admin/' + widgets[widget]).end(function assert(err, res) {
					expect(err).to.not.be.ok;
					expect(res).to.have.property('status', 200);
					done();
				});
			});
		}
	});

	describe('should allow setting changes on all widgets', function(){
		var old_state = state.current;
		beforeEach(function() {
			// Go to a generic data state
		});

		after(function() {
			// Revert to the old state
			state.update(old_state);
		});

		it('updates of general settings');
		it('ads broadcast messages');
		it('updates settings on casparCG');
		it('ads tweets with a URL');
		it('ads tweets with no URL');
		it('caches tweets and minimizes requests to embedly and twitter to one per tweet');
	});
});