var socket = io();
socket.on('connection', function () {
	console.log("Connection established");
});

socket.on('cpu', function(cpu) {
	$('#cpu').text(cpu);
});

socket.on('state', function(state) {
	console.log(state);
	for (var widget in state) {
		if (state[widget].visibility != undefined) {
			$('#'+widget).find('.eye').toggleClass('label-default', !state[widget].visibility);
			$('#'+widget).find('.eye').toggleClass('label-success', state[widget].visibility);
			$('#'+widget).find('.eye').find('i').toggleClass('glyphicon-eye-open', state[widget].visibility);
			$('#'+widget).find('.eye').find('i').toggleClass('glyphicon-eye-close', !state[widget].visibility);
		}
	}
});

$(document).ready(function(){
	$('button.getrequest').on('click', function(event){
		event.preventDefault();
		that = this;
		var url = $(this).attr('href');
		$.get(url);
	});
});