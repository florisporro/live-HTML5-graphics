exports.index = function(req, res) {
	res.render('countdown', { title: 'Countdown', widget: 'countdown' });
};