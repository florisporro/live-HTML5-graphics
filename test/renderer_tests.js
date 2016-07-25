var Browser = require('zombie');
var expect = require('chai').expect;
var assert = require('chai').assert;

var browser = new Browser({ debug: false });
browser.silent = true;

var fs = require('fs');
var state = require('../lib/state');

var path = require('path');
var url = require('url');

describe('Renderer page', function() {
	
	var renderer_url = url.parse('file://'+path.join(__dirname, "../graphics_render.html")).format();

	before(function(done){
		this.timeout(8000);
		browser.visit(renderer_url)
		.then(done);
	});

	it('should connect to socket.io server', function(){
		expect(browser.window.socket.connected).to.be.true;

		if (browser.window.socket.connected) {
			context('with an empty data.json file', function(){

				var old_state = state.current;

				before(function(done) {
					fs.unlinkSync('data.json');
					state.update();
					done();
				});

				after(function(done) {
					state.update(old_state);
					done();
				});

				it('should load', function() {
					expect(browser.assert.success()).to.be.true;
				});

				it('should hide all widgets', function(){
					expect(browser.assert.hasClass('.widget', 'hide')).to.be.true;
				});

				describe('broadcastMessage', function(){
					it('should have default text', function(){
						browser.assert.text('#broadcastMessage', 'We\'ll be back with you shortly!');
					});
				});

			});

			context('with fully populated data.json file', function(){

				var old_state = state.current;

				before(function() {
					state.update({"general":{"color1":"","color2":"","color3":"","color4":"","transparent_elements":"true","fonts":"modern","shadows":"true","animations":"fades","animation_length":"","preview":"true"},"casparCG":{},"clock":{"visibility":true},"countdown":{"visibility":true},"broadcastMessage":{"entries":[{"message":"Test"}],"visibility":"0"},"lowerThirds":{"entries":[{"name":"Floris Porro","function":"Technical Producer","company":"Stream My Event"}],"visibility":"0"},"logo":{"visibility":true,"file":"Icon-2015.jpg","width":"200","container":"true"},"geo":{},"schedule":{},"twitter":{"entries":[{"id":624908374660919300,"message":"Stream My Event - Showreel 2015/2016\nhttps://t.co/TiXvvaoGNk http://t.co/bupN8qWmKD","name":"Stream My Event","handle":"Stream_My_Event","img":"http://pbs.twimg.com/profile_images/709303856606216193/voW2CQ4W_normal.jpg","media":null}],"visibility":"0"}});
				});

				after(function() {
					state.update(old_state);
				});

				it('should show all widgets', function(){
					expect(browser.assert.hasNoClass('.widget', 'hide')).to.be.true;
				});

			});

		}
	});
});