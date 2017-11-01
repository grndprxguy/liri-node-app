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
var input = JSON.stringify(nodeArgs[3]);
console.log(input.replace(/\"/g, ""))
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

function tweets() {
	client.get('statuses/user_timeline',function(err, response) {
		if (err) {
    	return console.log('Error occurred: ' + err);
  	};
 	console.log(JSON.stringify(response));
 	})
};

function spotifyResp() {
	console.log("spotify");
	spotify.search({type: 'track', query: "'" + input + "'"}, function(err,data) {
		 if (err) {
    return console.log('Error occurred: ' + err);
  }
  if (input !== undefined){
  	var track = data.tracks.items[0];
  	console.log("Artists: " + track.Artists.name)}
  
	})
};

function omdbLookup() {
	console.log("omdb");
	var url = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=40e9cece";
	console.log(url);
	request(url, function(err,response,body) {
		console.log("Title: " + JSON.parse(body.Title));
		console.log("Year: " + JSON.parse(body.Year));
		console.log("IMDB Rating: " + JSON.parse(body.IMDB));
		console.log("Rotten Tomatoes Rating: " + JSON.parse(body.Rotten));
		console.log("Country: " + JSON.parse(body.Country));
		console.log("Language: " + JSON.parse(body.Language));
		console.log("Plot: " + JSON.parse(body.Plot));
		console.log("Actors: " + JSON.parse(body.Actors));
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