//process.stdout.write('\u001B[2J\u001B[0;0f');

var Twitter = require('twitter');
var readlineSync = require('readline-sync');

var config = {};

config.consumer_key = readlineSync.question('consumer_key: ');
config.consumer_secret = readlineSync.question('consumer_secret: ');
config.access_token_key = readlineSync.question('access_token_key: ');
config.access_token_secret = readlineSync.question('access_token_secret: ');


//development code
config = require('./config/debug');

var client = new Twitter(config);

var params = {screen_name: 'hotarun'};
client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
    console.log(tweets);
  }
});


