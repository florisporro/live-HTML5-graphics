"use strict"
var socket = io('http://localhost:3000');

var clock_offset = 0;
var countdown_target = 0;

socket.on('state', function (state) {

	window.state = state;

	console.log(state);

	var widgets = ['broadcastMessage', 'clock', 'countdown', 'logo', 'twitter', 'lowerThirds'];

	// Generic
	for (var i in widgets) {
		// Widget updating
		$('#'+widgets[i]).toggleClass('hide', !state[widgets[i]].visibility);

		// General styling
		$('#'+widgets[i]).toggleClass('font-techy', (state.general.fonts === 'techy'));
		$('#'+widgets[i]).toggleClass('font-modern', (state.general.fonts === 'modern'));
		$('#'+widgets[i]).toggleClass('font-classical', (state.general.fonts === 'classical'));
		$('#'+widgets[i]).toggleClass('shadowed', (state.general.shadows === 'true'));
		$('#'+widgets[i]).toggleClass('background-transparency', (state.general.transparent_elements === 'true'));
		$('#'+widgets[i]).toggleClass('background-solid', (state.general.transparent_elements === 'false'));
		$('#'+widgets[i]).toggleClass('animation-fades', (state.general.animations === 'fades'));
		
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
			$('#'+widgets[i]).text('');
		} else {
			$('#broadcastMessage').text(state.broadcastMessage.entries[state.broadcastMessage.visibility].message);
		}
	}

	// LOWER THIRDS
	if (state.lowerThirds.visibility !== false) {
		if (state.lowerThirds.entries[state.lowerThirds.visibility] === undefined) {
			console.log('lowerThirds hidden because message id does not exist. Deleted whilst showing?');
			$('#'+widgets[i]).text('');
		} else {
			console.log(state.lowerThirds.entries[state.lowerThirds.visibility].name);
			$('#lowerThirds #name').text(state.lowerThirds.entries[state.lowerThirds.visibility].name);
			$('#lowerThirds #function').text(state.lowerThirds.entries[state.lowerThirds.visibility].function);
			$('#lowerThirds #company').text(state.lowerThirds.entries[state.lowerThirds.visibility].company);
		}
	}

	// TWITTER
	if (state.twitter.visibility !== false) {
		$('#twitter img').attr('src', state.twitter.entries[state.twitter.visibility].img);
		$('#twitter').addClass('hide');
		$( "#twitter img" ).load(function() {
			$('#twitter').removeClass('hide');
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