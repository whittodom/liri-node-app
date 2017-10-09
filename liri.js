//grab data from keys.js
var keys = require('./keys.js');

//NPM packages
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require ('fs');

//What is the user command?
var userCommand = process.argv[2];
console.log(userCommand);

//What is the user search term?
var inputCommand = "";

for (var x = 3; x < process.argv.length; x++) {
   inputCommand += " " + process.argv[x];
};

function callSwitch(){
   switch (userCommand){
      case "my-tweets":
      console.log("Twitter");
      twitterApp();
      break;

      case "spotify-this-song":
      console.log("Spotify");
      spotifyApp();
      break;  

      case "movie-this":
      console.log("OMDB");
      omdb();
      break;   

      case "do-what-it-says":
      run();
      break;

      default:
      console.log("Please choose a valid command");     
   };
};callSwitch();

//'my-tweets'--show last 20 tweets & when created in terminal
function twitterApp(){
   console.log("Input: " + inputCommand);   

   var client = new Twitter(keys.twitterKeys);

   var params = {
      screen_name: 'odom_liri',
      count: 20
   };

   //Create Tweet
   client.post('statuses/update', {status: inputCommand},  function(error, tweet, response) {
      if (error){
         console.log('error', error);
         return;
      };   
     console.log("Tweet: " + tweet);  // Tweet body 
   });

   //Display 20 most recent Tweets
   client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (error){
         console.log('error', error);
         return;
      };

      for (t = 0; t < tweets.length; t++){
         console.log("Tweet: " + tweets[t].text + ", Created On: " + tweets[t].created_at); 
      }
   });  
};


// * `spotify-this-song` --
function spotifyApp(){
   console.log("Input: " + inputCommand);  

   var spotify = new Spotify(keys.spotifyKeys);

   if ( inputCommand === undefined || inputCommand === null) {
      inputCommand = 'The Sign';
   }; 

   spotify.search({ type: 'track', query: inputCommand, limit: 1}, function(error, data) {
      if (error){
         console.log('error: ', error);
         return;
      };

      //console.log("Track: " + data.tracks.items[0]);
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Album: " + data.tracks.items[0].album.name)
      console.log("Song Preview: " + data.tracks.items[0].preview_url);
   });
};


// * `movie-this`
function omdb(){
   console.log("Input: " + inputCommand);  

   if ( inputCommand === undefined || inputCommand === null) {
      inputCommand = 'Mr. Nobody';
   };    

   // Request to OMDB
   var queryUrl = "http://www.omdbapi.com/?t=" + inputCommand + "&y=&plot=short&apikey=40e9cece";

   request(queryUrl, function(error, response, body) {
      if (error){
         console.log('error', error);
         return;
      };
      // If the request is successful
      console.log("Film Title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country Produced: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot:" + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
   });   
};

// * `do-what-it-says`
function run(){
   fs.readFile('random.txt', 'utf8', function (error, data){
      if (error){
         console.log('error', error);
         return;
      };
      var runResults = data.split(',');
      userCommand = runResults[0];
      inputCommand = runResults[1];

      callSwitch();//run with new userCommand/Input
   });

};
