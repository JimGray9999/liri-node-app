// required node packages
var keys = require("./keys.js"); // holds API keys...shhhh
var twitAPI = require("twitter"); // Twitter package
var Spotify = require('node-spotify-api'); // Spotify package
var request = require("request"); // request package
var fs = require("fs"); // file system package
var inquirer = require("inquirer"); // inquirer package


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
var nodeArgs = process.argv; // all node args
var command = process.argv[2]; // command input
var search = process.argv[3]; // search parameter

// TODO Extra: inquirer function
    // ask the user what they would like to do

// execute program:
logCommand(); // log entered command, append to log.txt file
runLiri(); // check the command to determine function to run

function runLiri(){
    if (command === 'my-tweets') {
        myTweets();
    } else if (command === 'spotify-this-song') {
        // get info on song provided from Spotify API
        spotifyThis();
    } else if (command === 'movie-this') {
        movieThis();
    } else if (command === 'do-what-it-says') {
        // TODO: do what it says, read the random.txt file and execute command
        doWhatItSays();
    } else {
        console.log("Invalid command, please try again.");
    }
}


function logCommand(){
    // prep log.txt entry
    var timeStamp = new Date();
    if(nodeArgs[3] === undefined){
        var search = "N/A";
    } else{
        var search = nodeArgs[3];
    }
    var logStuff = `Date: ${timeStamp}\rCommand: ${nodeArgs[2]}\rSearch: ${search}\r
                    ----------\r`;
    // end prep log.txt entry

    // append recent LIRI command to log.txt file
    fs.appendFile("log.txt", logStuff, function(err){
        if (err){
            console.log(`File Write error: ${error}`);
        }
    });
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
    var searchString = "The Sign"; // search parameter
    if (search){
        searchString = search;
    }
    var songParams = { type: 'track', query: `${searchString}` };

    spotifyAccess.search(songParams, function(error, data) {
        if (error) { console.log("I am error: " + error); }

        for (i = 0 ; i < 20; i++){
            var albumName = data.tracks.items[i].album.name;
            var songName = data.tracks.items[i].name;
            var artistName = data.tracks.items[i].artists[0].name;
            var previewUrl = data.tracks.items[i].preview_url;
            
            if (previewUrl === null){
                previewUrl = "N/A";
            }
            console.log(`Artist(s): ${artistName}`);
            console.log(`Song Name: ${songName}`);
            console.log(`Preview: ${previewUrl}`);
            console.log(`Album: ${albumName}`);
            console.log("------------------------------");
        }

        // DEBUG ONLY: write results to a JSON file (testing purposes)
            // fs.writeFile("testy.json", JSON.stringify(data.tracks), function(err) {
            // // If the code experiences any errors it will log the error to the console.
            // if (err) {
            //     return console.log(err);
            // }});

        });
}

function movieThis(){
    var movieName = process.argv[3];
    var movieKey = keys.omdbKey.key;

    var queryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=${movieKey}`;

    request(queryUrl, function(error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

        //    * Title of the movie.
        //    * Year the movie came out.
        //    * IMDB Rating of the movie.
        //    * Rotten Tomatoes Rating of the movie.
        //    * Country where the movie was produced.
        //    * Language of the movie.
        //    * Plot of the movie.
        //    * Actors in the movie.

        // Then log the Release Year for the movie
        console.log("---------------------------------");
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year: " + JSON.parse(body).Year);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Release date: " + JSON.parse(body).Released);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Ratings:");
        if (JSON.parse(body).Ratings[0].Value === [null]) {
            return console.log("N/A  <-- IMDB");
        } else {
            console.log(JSON.parse(body).Ratings[0].Value + " <-- IMDB");
        }
        if (JSON.parse(body).Ratings[1].Value === null) {
            return console.log("N/A  <-- Rotten Tomatoes");
        } else {
            console.log(JSON.parse(body).Ratings[1].Value + " <-- Rotten Tomatoes");
        };
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
        console.log("---------------------------------");
    };
  });
}

function doWhatItSays(){
    fs.readFile("random.txt", "utf-8", function(err, data){
        if (err){
            console.log(`Read File Error: ${error}`);
        };

        var commandArr = data.split(",");
        command = commandArr[0];
        search = commandArr[1];
        runLiri();
    });
}
