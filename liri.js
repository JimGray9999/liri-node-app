// required node packages
var keys = require("./keys.js"); // holds API keys...shhhh
var twitAPI = require("twitter"); // Twitter package
var Spotify = require('node-spotify-api'); // Spotify package
var request = require("request"); // request package
var fs = require("fs");


// get the API keys assigned
var client = new twitAPI({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});
var spotifyAccess = new Spotify({
    id: keys.spotifyKeys.id,
    secret: keys.spotifyKeys.secret
});

// inputs
var command = process.argv[2]; // command input
var searchString = process.argv[3]; // search parameter

// Liri commands:

if (command === 'my-tweets') {
    // parameters for get call to API
    var params = { screen_name: "MinnieKittyCat", count: 20 };

    // GET call, display last 20 Tweets
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) throw error;

        console.log("Here are your Minnie Kitty Tweets!");
        for (i = 0; i < 20; i++) {
            console.log("----------------------------------------");
            console.log("Created at: " + tweets[i].created_at);
            console.log("Tweet text: " + tweets[i].text);
        }
    });
} else if (command === 'spotify-this-song') {
    // get info on song provided from Spotify API

    // define search parameters
    // options for type: artist, album or track
    var songParams = { type: 'track', query: `${searchString}` };

    spotifyAccess.search(songParams, function(error, data) {
        if (error) { console.log("I am error: " + error); }
        console.log(data);
        console.log("Artist(s): ");
        console.log("Song Name: ");
        console.log("Preview: ");
        console.log("Album: ");
        // https://developer.spotify.com/web-api/search-item/
    });
} else if (command === 'movie-this') {
    // TODO: OMDB the movie entered
} else if (command === 'do-what-it-says') {
    // TODO: do what it says, read the random.txt file and execute command
} else {
    console.log("Invalid command, please try again.")
}