var twitter = require('../lib/twitter');
var state = require("../lib/state");

function cache_tweets(cb){
	var cached_tweets = [];
	var responses = 0;

	for (var i in state.current.twitter.entries) {
		tweet = state.current.twitter.entries[i];
		if (tweet.tweetId === undefined) {
			cached_tweets.push(tweet);
			responses++;
			if (responses == state.current.twitter.entries.length) {
				cb(cached_tweets);
			}
		} else {
			twitter.get('statuses/show/'+tweet.tweetId, function(error, tweets, response){
				if (error) {
					console.log(error);
					throw new Error (error);
				}
				cached_tweets.push({
					'id': tweets.id,
					'message': tweets.text,
					'name': tweets.user.name,
					'handle': tweets.user.screen_name,
					'img': tweets.user.profile_image_url
				});
				responses++;
				if (responses == state.current.twitter.entries.length) {
					state.change('twitter', 'entries', cached_tweets);
					cb(cached_tweets);
				}
			});
		}
	}
}

exports.index = function(req, res) {
	cache_tweets(function(tweets){
		console.log(tweets);
		res.render('twitter', { title: 'Twitter', widget: 'twitter'});
	});
};