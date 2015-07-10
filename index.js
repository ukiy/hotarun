
var Twitter = require('twitter');
var readlineSync = require('readline-sync');
var _ = require('lodash');
var keypress = require('keypress');
keypress(process.stdin);
var state = 'timeline';
var status = {
  tweet: 'tweet',
  timeline: 'timeline',
};
var newTweet = null;

var config = {};
var tweets = [];

config.consumer_key = readlineSync.question('consumer_key: ');
config.consumer_secret = readlineSync.question('consumer_secret: ');
config.access_token_key = readlineSync.question('access_token_key: ');
config.access_token_secret = readlineSync.question('access_token_secret: ');



//development code
config = require('./config/debug');

var client = new Twitter(config);

client.stream('user', function(stream) {
  stream.on('data', function(tweet) {
    if(tweet.text){
      tweets.unshift(tweet);
      show();
    }
  });

  stream.on('error', function(error) {
    throw error;
  });
});

var show = function(){
  if(state !== status.timeline){
    process.stdout.write('\u001B[2J\u001B[0;0f');
    return ;
  }
  process.stdout.write('\u001B[2J\u001B[0;0f');
  tweets.forEach(function(t){
    process.stdout.write(t.user.name+' '+t.user.screen_name+'\n');
    process.stdout.write(t.text+'\n\n');
  });
};

process.stdin.on('keypress', function(ch, key){
  //console.log('got "keypress"', key);
  //console.log(ch);
  if (key && key.ctrl && key.name == 'c') {
    process.exit();
  }
  if(state === status.timeline &&
     key && key.name === 't'){
    state = status.tweet;
    show();
    process.stdout.write('You can tweet!\n');
    return;
  }
  if(state === status.tweet &&
     key && key.ctrl && key.name === 't'){
    client.post('statuses/update', {status: newTweet},  function(error, tweet, response){
      if(error) throw error;
      console.log(tweet);  // Tweet body.
      console.log(response);  // Raw response object.
      newTweet = null;
      state = status.timeline;
      show();
    });
  }
  if(state === status.tweet &&
     key && key.name === 'backspace' && newTweet ){
    newTweet = newTweet.substring(0, newTweet.length-1);
    show();
    process.stdout.write('You can tweet!\n');
    process.stdout.write(newTweet);
    return;
  }
  if(state === status.tweet){
    newTweet = newTweet || '';
    newTweet += ch;
    show();
    process.stdout.write('You can tweet!\n');
    process.stdout.write(newTweet);
    return;
  }
});


process.stdin.setRawMode(true);
process.stdin.resume();

