var socket = io();
socket.on('connection', function () {
	console.log("Connection established");
});

socket.on('cpu', function(cpu) {
	$('#cpu').text(cpu);
});

$('button').on('click', function(event){
	event.preventDefault();
	that = this;
	var url = $(this).attr('href');
	$.get(url, function(data){
		console.log(data);
	});
});