var socket = io();
socket.on('connection', function () {
	console.log("Connection established");
});

socket.on('cpu', function(cpu) {
	$('#cpu').text(cpu);
});

socket.on('internet', function(internet) {
	$('#internet').text((internet === true ? 'yes' : 'no'));
	$('#internet').toggleClass('label-success', internet);
	$('#internet').toggleClass('label-danger', !internet);
});

socket.on('state', function(state) {
	window.state = state;

	for (var widget in state) {
		if (state[widget].visibility != undefined) {
			$('#navigation #'+widget).find('.eye').toggleClass('label-default', !state[widget].visibility);
			$('#navigation #'+widget).find('.eye').toggleClass('label-success', state[widget].visibility);
			$('#navigation #'+widget).find('.eye').find('i').toggleClass('glyphicon-eye-open', state[widget].visibility);
			$('#navigation #'+widget).find('.eye').find('i').toggleClass('glyphicon-eye-close', !state[widget].visibility);
		}
	}
});

$(document).ready(function(){
	$(document).on('click', 'button.getrequest', function(event){
		event.preventDefault();
		var url = $(this).attr('href');
		$.get(url);
	});

	$(document).on('click', 'button.delete', function(event){
		event.preventDefault();
		$btn = $(event.target);

		if (window.confirm("Are you sure?")) {
			var url = $(this).attr('href');
			$.post(url, function(data){
				$btn.parents('li').slideUp(function(){
					this.remove();
				});
				console.log(data);
			});
		}
	});

	$('form.add_new').submit(function(event){
		event.preventDefault();
		$form = $(event.target);

		$.post( $form.attr('action'), $form.serialize(), function(data){
			$form.each(function(){
			    this.reset();
			});

			$list = $form.nextAll('ul');

			newEntry = `<li class="list-group-item">
			<div style="margin-left: 1em" class="btn-group pull-right clearfix">
			<button href="/admin/${data.widget}/${data.id}/show" class="getrequest btn btn-success">
			 <i class="glyphicon glyphicon-eye-open">
			 </i>
			 Show</button>
			 </div>
			<div class="btn-group pull-right clearfix">
			<button href="/admin/${data.widget}/entries/${data.id}/delete" class="delete btn btn-danger">
			Delete</button>
			</div>
			<span class="clearfix">
			${data.data.message}</span></li>`;

			$list.append(newEntry);

		});
	});
});