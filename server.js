const express = require('express');
const app = express();
const bodyParser = require("body-parser");
var routeFunctions = require('./api/routeFunctions.js');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Listen to the port provided by the environment
app.listen(process.env.PORT || 8080, () => console.log(`Server running on ${process.env.PORT || 8080}`));

app.get('/tweets', routeFunctions.getTweets);

app.post('/tweets', routeFunctions.addTweet);

app.post('/tweets/:id/likes', routeFunctions.addLike);

app.post('/tweets/:id/retweet', routeFunctions.addRetweet);

app.get('/retweets', routeFunctions.getRetweets);
