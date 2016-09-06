"use strict"
// This bit is in case we are in automated testing mode, in that case we want to modify the port to what's set in the url parameters
var params={};window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(str,key,value){params[key] = value;});
if (params.port) {
	window.socket = io('http://localhost:'+params.port);
} else {
	window.socket = io('http://localhost:3000');
}

var clock_offset = 0;
var countdown_target = 0;

window.socket.on('connect', function(){
	console.log("Connected to server");
});

window.socket.on('state', function (state) {
	// Setup some defaults
	if (state.general.animation_length === "" || undefined) {
		state.general.animation_length = 1000;
	}

	window.state = state;

	console.log(state);

	// var widgets = ['broadcastMessage', 'clock', 'countdown', 'logo', 'twitter', 'lowerThirds'];
	var widgets = [
		{
			name: 'broadcastMessage',
			transitionDirection: 'bottom'
		},
		{
			name: 'clock',
			transitionDirection: 'left'
		},
		{
			name: 'countdown',
			transitionDirection: 'left'
		},
		{
			name: 'logo',
			transitionDirection: 'right'
		},
		{
			name: 'twitter',
			transitionDirection: 'right'
		},
		{
			name: 'lowerThirds',
			transitionDirection: 'left'
		},
		];

	function hideWidget(widget) {
		setTimeout(function(){
			$('#'+widget).addClass('hide');
		}, state.general.animation_length + 500);
	}

	// Generic
	for (var i in widgets) {

		// Widget updating
		if (!state[widgets[i].name].visibility) {
			
			// As a matter of fallback, we set the hide class on widgets that are meant to disappear in-case the animation doesn't work.
			// This also helps us keep track of which widgets are active and which are not.
			hideWidget(widgets[i].name);

			switch(state.general.animations) {
				case 'fades':
					$('#'+widgets[i].name).velocity({ opacity: 0 }, { duration: state.general.animation_length });
					break;
				case 'slides':
					switch(widgets[i].transitionDirection){
						case 'top':
							$('#'+widgets[i].name).velocity({
							    translateY: "-1080px"
							}, { duration: state.general.animation_length,
								 easing: "easeInOutQuint" });
						break;
						case 'right':
							$('#'+widgets[i].name).velocity({
							    translateX: "1920px"
							}, { duration: state.general.animation_length,
								 easing: "easeInOutQuint" });
						break;
						case 'bottom':
							$('#'+widgets[i].name).velocity({
							    translateY: "1080px"
							}, { duration: state.general.animation_length,
								 easing: "easeInOutQuint" });
						break;
						case 'left':
							$('#'+widgets[i].name).velocity({
							    translateX: "-1920px"
							}, { duration: state.general.animation_length,
								 easing: "easeInOutQuint" });
						break;
					}
					break;
				case 'perspective':
					break;
				case 'character':
					break;
				case 'bouncy':
					switch(widgets[i].transitionDirection){
						case 'top':
							$('#'+widgets[i].name).velocity({
							    translateY: "-1080px"
							}, { duration: state.general.animation_length,
								 easing: "easeInOutBack" });
						break;
						case 'right':
							$('#'+widgets[i].name).velocity({
							    translateX: "1920px"
							}, { duration: state.general.animation_length,
								 easing: "easeInOutBack" });
						break;
						case 'bottom':
							$('#'+widgets[i].name).velocity({
							    translateY: "1080px"
							}, { duration: state.general.animation_length,
								 easing: "easeInOutBack" });
						break;
						case 'left':
							$('#'+widgets[i].name).velocity({
							    translateX: "-1920px"
							}, { duration: state.general.animation_length,
								 easing: "easeInOutBack" });
						break;
					}
					break;
				default:
			}
		} else {
			$('#'+widgets[i].name).removeClass('hide');

			switch(state.general.animations) {
				case 'fades':
					$('#'+widgets[i].name).velocity({ opacity: 1 }, { duration: state.general.animation_length });
					break;
				case 'slides':
					$('#'+widgets[i].name).velocity({
					    translateY: "0px",
					    translateX: "0px"
					}, { duration: state.general.animation_length,
						 easing: "easeInQuint" });
					break;
				case 'perspective':
					break;
				case 'character':
					break;
				case 'bouncy':
					$('#'+widgets[i].name).velocity({
					    translateX: "0",
					    translateY: "0"
					}, { duration: state.general.animation_length,
						 easing: [500,30] });
					break;
				default:
			}
		}


		// General styling
		$('#'+widgets[i].name).toggleClass('font-techy', (state.general.fonts === 'techy'));
		$('#'+widgets[i].name).toggleClass('font-modern', (state.general.fonts === 'modern'));
		$('#'+widgets[i].name).toggleClass('font-classical', (state.general.fonts === 'classical'));
		$('#'+widgets[i].name).toggleClass('style-rounded', (state.general.style === 'rounded'));
		$('#'+widgets[i].name).toggleClass('style-square', (state.general.style === 'square'));
		$('#'+widgets[i].name).toggleClass('shadowed', (state.general.shadows === 'true'));
		$('#'+widgets[i].name).toggleClass('background-transparency', (state.general.transparent_elements === 'true'));
		$('#'+widgets[i].name).toggleClass('background-solid', (state.general.transparent_elements === 'false'));
		
		// Primary Color
		$('.widget').css('border-bottom-color', state.general.color1);

		// Secondary Color


		// Background color
		$('.widget').css('background', state.general.color3);

		// Text color
		$('.widget').css('color', state.general.color4);
	}
	$('body').toggleClass('preview', (state.general.preview === 'true'));

	// BROADCASTMESSAGE
	if (state.broadcastMessage.visibility !== false) {
		if (state.broadcastMessage.entries[state.broadcastMessage.visibility] === undefined) {
			console.log('BroadcastMessage hidden because message id does not exist. Deleted whilst showing?');
			$('#'+widgets[i].name).text('');
		} else {
			$('#broadcastMessage').text(state.broadcastMessage.entries[state.broadcastMessage.visibility].message);
		}
	}

	// LOWER THIRDS
	if (state.lowerThirds.visibility !== false) {
		if (state.lowerThirds.entries[state.lowerThirds.visibility] === undefined) {
			console.log('lowerThirds hidden because message id does not exist. Deleted whilst showing?');
			$('#'+widgets[i].name).text('');
		} else {
			$('#lowerThirds #name').text(state.lowerThirds.entries[state.lowerThirds.visibility].name);
			$('#lowerThirds #function').text(state.lowerThirds.entries[state.lowerThirds.visibility].function);
			$('#lowerThirds #company').text(state.lowerThirds.entries[state.lowerThirds.visibility].company);
		}
	}

	// TWITTER
	if (state.twitter.visibility !== false) {
		$('#twitter img#author').attr('src', state.twitter.entries[state.twitter.visibility].img);
		if (state.twitter.entries[state.twitter.visibility].media !== null) {
			$('#twitter img#media_thumbnail').show();
			$('#twitter img#media_thumbnail').attr('src', state.twitter.entries[state.twitter.visibility].media);
			$('#twitter img#media_thumbnail').toggleClass('shadowed', (state.general.shadows === 'true'));
		} else {
			$('#twitter img#media_thumbnail').hide();
		}
		$('#twitter').addClass('hide');
		$( "#twitter img" ).load(function() {
			$('#twitter').removeClass('hide');
			$('#twitter img#media_thumbnail').removeClass('hide');
		});
		$('#twitter p').html("&#8220;"+state.twitter.entries[state.twitter.visibility].message+"&#8221;");
		$('#twitter #name').text(state.twitter.entries[state.twitter.visibility].name);
		$('#twitter #handle').text('@'+state.twitter.entries[state.twitter.visibility].handle);
	}

	// CLOCK
	clock_offset = state.clock.offset;

	// COUNTDOWN
	countdown_target = state.countdown.target;
	$('#countdown').toggleClass('underneath_clock', (state.countdown.style === 'underneath_clock'));
	$('#countdown').toggleClass('center', (state.countdown.style === 'center'));
	$('#countdown').toggleClass('lower', (state.countdown.style === 'lower'));

	// LOGO
	$('#logo img').attr('src', './live-content/'+state.logo.file);
	$('#logo').css('width', state.logo.width);
	$('#logo').toggleClass('widget', !(state.logo.container === 'false'));
	$('#logo').toggleClass('shadowed', !(state.logo.container === 'false'));
	$('#logo').toggleClass('background-solid', !(state.logo.container === 'false'));
	$('#logo').toggleClass('background-transparency', !(state.logo.container === 'false'));

});

function updateClock() {
	var d = new Date();
	var currentMinutes = d.getMinutes();
	var currentSeconds = d.getSeconds();
	var currentHours = Number(d.getHours()) + Number(clock_offset);
	if(currentMinutes.toString().length == 1) {
	  currentMinutes = "0" + currentMinutes;
	}
	if (currentSeconds.toString().length == 1) {
	  currentSeconds = "0" + currentSeconds;
	}

	$('#clock').html(currentHours + ':' + currentMinutes + ':' + currentSeconds);
}
setInterval(updateClock, 500);

function updateCountdown() {
	var t = Date.parse(countdown_target) - Date.parse(new Date());

	var seconds = Math.floor( (t/1000) % 60 );
	var minutes = Math.floor( (t/1000/60) % 60 );
	var hours = Math.floor( (t/(1000*60*60)) % 24 );
	var days = Math.floor( t/(1000*60*60*24) );

	if(minutes.toString().length == 1) {
	  minutes = "0" + minutes;
	}
	if (seconds.toString().length == 1) {
	  seconds = "0" + seconds;
	}
	if (hours.toString().length == 1) {
	  hours = "0" + hours;
	}

	var string = hours + ':' + minutes + ":" + seconds;

	$('#countdown').html(string);
}
setInterval(updateCountdown, 500);