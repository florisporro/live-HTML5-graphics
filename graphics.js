var socket = io('http://localhost:3000');

var offset = 0;

socket.on('state', function (state) {

	window.state = state;

	console.log(state);

	var widgets = ['broadcastMessage', 'clock', 'logo'];

	// Generic
	for (let i in widgets) {
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

	// BROADCASTMESSAGE
	if (state.broadcastMessage.visibility != false) {
		if (state.broadcastMessage.entries[state.broadcastMessage.visibility] === undefined) {
			console.log('BroadcastMessage hidden because message id does not exist. Deleted whilst showing?');
			$('#'+widgets[i]).text('');
		} else {
			$('#broadcastMessage').text(state.broadcastMessage.entries[state.broadcastMessage.visibility].message);
		}
	}

	// CLOCK
	offset = state.clock.offset;

	// Logo
	$('#logo img').attr('src', './live-content/'+state.logo.file);
	$('#logo').css('width', state.logo.width);
	$('#logo').toggleClass('widget', !(state.logo.container === 'false'));
	$('#logo').toggleClass('shadowed', !(state.logo.container === 'false'));
	$('#logo').toggleClass('background-solid', !(state.logo.container === 'false'));
	$('#logo').toggleClass('background-transparency', !(state.logo.container === 'false'));

});

function updateClock() {
	d = new Date();
	currentMinutes = d.getMinutes();
	currentSeconds = d.getSeconds();
	currentHours = Number(d.getHours()) + Number(offset);
	if(currentMinutes.toString().length == 1) {
	  currentMinutes = "0" + currentMinutes;
	}
	if (currentSeconds.toString().length == 1) {
	  currentSeconds = "0" + currentSeconds;
	}

	$('#clock').html(currentHours + ':' + currentMinutes + ':' + currentSeconds);
}
setInterval(updateClock, 500);