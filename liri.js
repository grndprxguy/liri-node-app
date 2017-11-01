var keys = require("./keys.js")
var request = require("request");
var inquirer = require("inquirer");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs");
var movieName = "";

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

// var firstPrompt = [{
// 	type: "list",
// 	name: "doWhat",
// 	message: "Please enter a command",
// 	choices: ["my-tweets","spotify-this-song","movie-this","do-what-it-says"]
// }];

// var songPrompt = [{
// 	type: "input",
// 	name: "songName",
// 	message: "What song would you like to look up?"
// }]

// // function liriApp(answers){
// // 	console.log("end")
// // 	};

// function to look up tweets
function tweets() {
	client.get('statuses/user_timeline',function(err, response) {
		if (err) {
    	return console.log('Error occurred: ' + err);
  	};
  	for (i=0;i < 5; i++) {
 	console.log(JSON.stringify(response[i].text));
 }
 	})
};

// function to look up spotify
function spotifyResp() {
	console.log("spotify");
	spotify.search({type: 'track', query: "'" + input + "'"}, function(err,data) {
		 if (err) {
    return console.log('Error occurred: ' + err);
  }
  if (input !== undefined){
  	var track = data.tracks.items[0];
  	console.log("Artists: " + track.artists[0].name)
  	console.log("Album: " + track.album.name)
  	console.log("Track Name: " + track.name);
  	console.log("Preview: " + track.href);
  }
  
	})
};

// function to look up OMDB
function omdbLookup() {
	console.log("omdb");
	var url = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=40e9cece";
	request(url, function(err,response,body) {
		var obj = JSON.parse(body);
		console.log("Title: " + obj.Title);
		console.log("Year: " + obj.Year);
		console.log("IMDB Rating: " + obj.IMDB);
		console.log("Rotten Tomatoes Rating: " + obj.Rotten);
		console.log("Country: " + obj.Country);
		console.log("Language: " + obj.Language);
		console.log("Plot: " + obj.Plot);
		console.log("Actors: " + obj.Actors);
	});
}

function whatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		console.log(data);
	});
};


// inquirer.prompt(firstPrompt).then(function(answer) {
// 	console.log(answer);
// 	if (answer.doWhat = "my-tweets") {
// 		tweets();
// 	} else if 
// 		(answer.doWhat = "spotify-this-song"){
// 			inquirer.prompt(songPrompt).then(function(songAnswer) {
// 				spotifyResp();
// 			})
// 		}
// });

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