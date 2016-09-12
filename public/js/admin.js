var socket = io();
socket.on('connection', function () {
	console.log("Connection established");
});

socket.on('cpu', function(cpu) {
	$('#cpu').text(cpu);
});

socket.on('clients', function(clients) {
	$('#clients').text(clients);
});

socket.on('internet', function(internet) {
	$('#internet').text((internet === true ? 'yes' : 'no'));
	$('#internet').toggleClass('label-success', internet);
	$('#internet').toggleClass('label-danger', !internet);
});

socket.on('casparCG', function(casparCG) {
	$('#casparCG').text((casparCG === true ? 'yes' : 'no'));
	$('#casparCG').toggleClass('label-success', casparCG);
	$('#casparCG').toggleClass('label-danger', !casparCG);

	if(casparCG){
		$('button[href="/admin/casparcg/connect"]').attr('disabled', 'disabled');
	} else {
		$('button[href="/admin/casparcg/connect"]').removeAttr('disabled');
	}
});

socket.on("versionmismatch", function(){
	alert("Warning: renderer version mismatch");
});

socket.on('state', function(state) {
	window.state = state;

	for (var widget in state) {
		if(state[widget].visibility){
			// Control UI in nav menu
			$('#navigation #'+widget).find('.eye').addClass('label-success');
			$('#navigation #'+widget).find('.eye').removeClass('label-default');
			$('#navigation #'+widget).find('.eye').find('i').addClass('glyphicon-eye-open');
			$('#navigation #'+widget).find('.eye').find('i').removeClass('glyphicon-eye-close');

			// Control UI for buttons
			$('body[id='+widget+']').find('.delete').attr('disabled', 'disabled');

			// Make header red if widget is active
			$('body[id='+widget+'] .header').addClass('active');

			// Control show / hide buttons for further emphasis
			$('body[id='+widget+'] button[href*="show"]').attr('disabled', 'disabled');
			$('body[id='+widget+'] button[href*="hide"]').removeAttr('disabled');
		} else {
			// Control UI in nav menu
			$('#navigation #'+widget).find('.eye').addClass('label-default');
			$('#navigation #'+widget).find('.eye').removeClass('label-success');
			$('#navigation #'+widget).find('.eye').find('i').addClass('glyphicon-eye-close');
			$('#navigation #'+widget).find('.eye').find('i').removeClass('glyphicon-eye-open');

			// Control UI for buttons
			$('body[id='+widget+']').find('.delete').removeAttr('disabled');

			// Make header red if widget is active
			$('body[id='+widget+'] .header').removeClass('active');

			// Control show / hide buttons for further emphasis
			$('body[id='+widget+'] button[href*="hide"]').attr('disabled', 'disabled');
			$('body[id='+widget+'] button[href*="show"]').removeAttr('disabled');
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
				location.reload();
				// $btn.parents('li').slideUp(function(){
				// 	this.remove();
				// });
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
			${data.data.message || data.data.name+" / "+data.data.function+" | "+data.data.company}</span></li>`;

			$list.append(newEntry);

		});
	});
});