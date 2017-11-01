var keys = require("./keys.js")
var request = require("request");
var inquirer = require("inquirer");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs");

var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

var spotify = new Spotify({
  id: keys.spotifyKeys.id,
  secret: keys.spotifyKeys.secret
});

var nodeArgs = process.argv;
var action = nodeArgs[2];
var input1 = JSON.stringify(nodeArgs.slice(3));
var input = encodeURIComponent(input1);
str = "";

// function to look up tweets
function tweets() {
	client.get('statuses/user_timeline',function(err, data) {
		if (err) {
    	return console.log('Error occurred: ' + err);
  	};
  	for (i=0;i < 5; i++) {
  		console.log("----------------------")
 		console.log(JSON.stringify(data[i].text));
 	}
 })
};

// function to look up spotify
function spotifyResp() {
	if (input !== "%5B%5D"){
		console.log(input)
		spotify.search({type: 'track', query: "'" + input + "'"}, function(err,data) {
			if (err) {
    	return console.log('Error occurred: ' + err);
  	}
  	var track = data.tracks.items[0];
  	console.log("----------------------")
  	console.log("Artists: " + track.artists[0].name)
  	console.log("Album: " + track.album.name)
  	console.log("Track Name: " + track.name);
  	console.log("Preview: " + track.href);
  	console.log("----------------------")
  });
  } else {
  	input = "The Sign";
  	console.log(input)
	spotify.search({type: 'track', query: "the+sign"}, function(err,data) {
		if (err) {
	return console.log('Error occurred: ' + err);
	}
  	var track = data.tracks.items[0];
  	console.log("----------------------")
  	console.log("Artists: " + track.artists[0].name)
  	console.log("Album: " + track.album.name)
  	console.log("Track Name: " + track.name);
  	console.log("Preview: " + track.href);
  	console.log("----------------------")
  });
};
}

// function to look up OMDB
function omdbLookup() {
	console.log("omdb");
	var url = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=40e9cece";
	request(url, function(err,data,body) {
		var obj = JSON.parse(body);
		console.log("----------------------")
		console.log("Title: " + obj.Title);
		console.log("Year: " + obj.Year);
		console.log("IMDB Rating: " + obj.IMDB);
		console.log("Rotten Tomatoes Rating: " + obj.Rotten);
		console.log("Country: " + obj.Country);
		console.log("Language: " + obj.Language);
		console.log("Plot: " + obj.Plot);
		console.log("Actors: " + obj.Actors);
		console.log("----------------------")
	});
}

function whatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			console.log("Something went wrong " + error)
		} else {
			result = data.split(",");
			action = result[0];
			input = result[1];
			argTest(action, input);
		}
	});
};

function argTest() {
	for (var i = 2; i < nodeArgs.length; i++) {
		str = str + " " + nodeArgs[i];
	}

	if (action == "my-tweets") {
		tweets();
	} else if
	(action == "spotify-this-song") {
		spotifyResp();
	} else if 
	(action == "movie-this") {
		omdbLookup();
	} else if 
	(action == "do-what-it-says") {
		whatItSays();
	}
}
argTest();