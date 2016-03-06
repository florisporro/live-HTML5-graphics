exports.index = function(req, res) {
	res.render('geo', { title: 'Geo', widget: 'geo' });
};