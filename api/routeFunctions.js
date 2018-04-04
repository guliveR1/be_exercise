const psqlHelper = require('./psqlHelper.js');

module.exports.getTweets = function(req, res) {
    var query = 'SELECT id, content, username, to_char(timestamp, \'DD/MM/YYYY HH24:MI:SS\'), COALESCE(likes_count, 0) as likes_count, COALESCE(retweets_count, 0) as retweets_count\n' +
        'FROM tweets \n' +
        '\tLEFT OUTER JOIN ' +
        '(SELECT post_id, COUNT(*) as retweets_count FROM retweets GROUP BY post_id) as retweets_by_tweet ' +
        'ON (tweets.id = retweets_by_tweet.post_id) \n' +
        '\tLEFT OUTER JOIN ' +
        '(SELECT post_id, COUNT(*) as likes_count FROM likes GROUP BY post_id) as likes_by_tweet ' +
        'ON (tweets.id = likes_by_tweet.post_id)';

    psqlHelper.selectRows(res, query);
};

module.exports.getRetweets = function(req, res) {
    var query = 'SELECT content, retweets.username as retweet_user, id as tweet_id, tweets.username as tweet_user, retweets.timestamp\n' +
        'FROM retweets\n' +
        '\tJOIN tweets ON retweets.post_id = tweets.id;';

    psqlHelper.selectRows(res, query);
};

module.exports.addTweet = function(req, res) {
    // Get the body params
    var content = req.body.content;
    var username = req.body.username;

    // Validate request body
    if (content === undefined || content === null ||
        username === undefined || username === null) {
        res.status(400);
        return res.send("You should send valid content and username.")
    }

    // Add the record
    psqlHelper.addRow(res, 'INSERT INTO tweets(content, username) values($1, $2)', [content, username]);
};

module.exports.addLike = function(req, res) {
    // Get the body params
    var id = req.params.id;
    var username = req.body.username;

    // Validate request body
    if (username === undefined || username === null || isNaN(id)) {
        res.status(400);
        return res.send("You should send valid username and id.");
    }

    // Check if the tweet exists and add the record
    psqlHelper.runIfTweetExists(res, id, () => {
        psqlHelper.addRow(res, 'INSERT INTO likes(post_id, username) values($1, $2)', [id, username])
    });
};

module.exports.addRetweet = function(req, res) {
    // Get the body params
    var id = req.params.id;
    var username = req.body.username;

    // Validate request body
    if (username === undefined || username === null || isNaN(id)) {
        res.status(400);
        return res.send("You should send valid username and id.");
    }

    // Check if the tweet exists and add the record
    psqlHelper.runIfTweetExists(res, id, () => {
        psqlHelper.addRow(res, 'INSERT INTO retweets(post_id, username) values($1, $2)', [id, username]);
    });
};