var socket = io('http://localhost:3000');

var offset = 0;

socket.on('state', function (state) {

	window.state = state;

	// BROADCASTMESSAGE
	if (state.broadcastMessage.visibility !== false) {
		console.log(state.broadcastMessage.entries[state.broadcastMessage.visibility].message);
	}

	// CLOCK
	$('#clock').toggleClass('hide', !state.clock.visibility);
	offset = state.clock.offset;
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