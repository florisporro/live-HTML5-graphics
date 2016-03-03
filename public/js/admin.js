var socket = io();
socket.on('connection', function () {
	console.log("Connection established");
});

socket.on('cpu', function(cpu) {
	$('#cpu').text(cpu);
});

socket.on('state', function(state) {
});

$(document).ready(function(){
	$('button.getrequest').on('click', function(event){
		event.preventDefault();
		that = this;
		var url = $(this).attr('href');
		$.get(url);
	});
});