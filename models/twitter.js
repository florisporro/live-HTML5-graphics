var twitter = require('../lib/twitter');
var state = require("../lib/state");

var embedly = require('../lib/embedly');
var util = require('util');

function cache_tweets(cb){
	var cached_tweets = [];
	var responses = 0;

	if(state.current.twitter.entries.length > 0) {
		for (var i in state.current.twitter.entries) {
			tweet = state.current.twitter.entries[i];
			if (tweet.tweetId === undefined) {
				cached_tweets.push(tweet);
				responses++;
				if (responses == state.current.twitter.entries.length) {
					cb(cached_tweets);
				}
			} else {
				function storeNewTweet(tweet, media){
					cached_tweets.push({
						'id': tweet.id,
						'message': tweet.text,
						'name': tweet.user.name,
						'handle': tweet.user.screen_name,
						'img': tweet.user.profile_image_url,
						'media': media || null
					});
					responses++;
					if (responses == state.current.twitter.entries.length) {
						state.change('twitter', 'entries', cached_tweets);
						cb(cached_tweets);
					}
				}

				twitter.get('statuses/show/'+tweet.tweetId, function(error, tweet, response){
					if (error) {
						console.log(error);
						throw new Error (error);
					}
					
					if (tweet.entities.urls[0].url) {
						embedly.oembed({url: tweet.entities.urls[0].url}, function(err, objs) {
							if (!!err) {
								console.error('request #1 failed');
								console.error(err.stack, objs);
								return 'error';
							}
							console.log('url: ' + tweet.entities.urls[0].url);
							console.log('thumbnail: ' + objs[0].thumbnail_url);
							storeNewTweet(tweet, objs[0].thumbnail_url);
						});
					} else {
						storeNewTweet(tweet);
					}
				});
			}
		}
	} else {
		cb([]);
	}
}

exports.index = function(req, res) {
	cache_tweets(function(tweets){
		console.log(tweets);
		res.render('twitter', { title: 'Twitter', widget: 'twitter'});
	});
};