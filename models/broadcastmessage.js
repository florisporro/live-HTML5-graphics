exports.index = function(req, res) {
	res.render('broadcastmessage', { title: 'Broadcast Message', widget: 'broadcastMessage' });
};

exports.update = function(req, res) {
	res.send('UPDATE PAGE');
	next();
};