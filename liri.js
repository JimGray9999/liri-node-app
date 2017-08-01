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

// BONUS TODO: 
// append the command + searchString to a log.txt file

// Liri commands:

if (command === 'my-tweets') {
    myTweets();
} else if (command === 'spotify-this-song') {
    // get info on song provided from Spotify API
    spotifyThis();
    
    
} else if (command === 'movie-this') {
    // TODO: OMDB the movie entered
} else if (command === 'do-what-it-says') {
    // TODO: do what it says, read the random.txt file and execute command
} else {
    console.log("Invalid command, please try again.")
}

function myTweets(){
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
}

function spotifyThis(){
    // define search parameters
    // options for type: artist, album or track
    var songParams = { type: 'track', query: `${searchString}` };

    spotifyAccess.search(songParams, function(error, data) {
        if (error) { console.log("I am error: " + error); }
        
        // console log testing lines
        // console.log(data.tracks.items);
        // console.log(data.tracks.items[0].album.name);
        // console.log(data.tracks.items[0].name);
        // console.log(data.tracks.items[0].artists[0].name);  // artist name
        // console.log(data.tracks.items[0].preview_url);

        var albumName = data.tracks.items[1].album.name;
        var songName = data.tracks.items[1].name;
        var artistName = data.tracks.items[1].artists[0].name;
        var previewUrl = data.tracks.items[1].preview_url;
        
        if (previewUrl === null){
            previewUrl = "N/A";
        }
        
        console.log(`Artist(s): ${artistName}`);
        console.log(`Song Name: ${songName}`);
        console.log(`Preview: ${previewUrl}`);
        console.log(`Album: ${albumName}`);
        // https://developer.spotify.com/web-api/search-item/

        
        // write results to a JSON file (testing purposes)
        // fs.writeFile("testy.json", JSON.stringify(data.tracks), function(err) {
        // // If the code experiences any errors it will log the error to the console.
        // if (err) {
        //     return console.log(err);
        // }});
        });
}
