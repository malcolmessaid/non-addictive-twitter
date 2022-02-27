const express = require('express')
const fetch = require('node-fetch')


const {env} = require('./env.js');
const {sample_tweet} = require('./sample.js');
const port = process.env.PORT || 5000;

const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const frontEndDir = require('path').join(__dirname, "frontend/");
const { Client, Pool } = require('pg');
// const {index} = require('./index.js');


const ACCOUNTS = {2407905670:'nathanaclark' , 293054700: 'Flav_Bateman'}


const pool = new Pool({
  connectionString: process.env.HEROKU_POSTGRESQL_IVORY_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
pool.connect().catch(function(err){
  console.log(err);
});
pool.query('select * from my_schema.tweets;', (err, res) => {
  if (err){
    console.log(err);
    throw err;
  }
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  pool.end();
});


async function pull_tweet(id)
{
  const str = `https://api.twitter.com/2/tweets/1496087033093230599`
  console.log(str);
  const options = {
    headers: new fetch.Headers({
        'Authorization': env.bearer,
    }),
  }
  var res = await fetch(str, options).then(res => res.text())
    .then(data => {

      return JSON.parse(data)
    })
}


/*pull_timeline_outer : Pulls recent tweets from given user
    user_id: User whose timeline you are pulling
    last_tweet_id: most recent tweet pulled. Used to only pull tweets after this
*/
async function pull_timeline_outer(user_id, last_tweet_id)
{
  const str = `https://api.twitter.com/2/users/${user_id}/tweets?since_id=${last_tweet_id}&expansions=attachments.media_keys,referenced_tweets.id,in_reply_to_user_id`
  res = await fetch(str,
  {
    headers: new fetch.Headers({
        'User-Agent':'art_project_2_3',
        'Authorization': env.bearer,
    }),
  }).then(res => res.text())
    .then(data => {
      // console.log("Printing Recent Tweets")
      return JSON.parse(data)
    })
  return res
}


/*parse_tweet_object : parses tweet object to be sent to database
    user_id: User whose timeline you are pulling
    json: json object of tweets recieved from twitter API
*/
async function parse_tweet_object(user_id, json, last_tweet_id){
  const data = json["data"]
  let newest_id = json.meta.newest_id


  const pool = new Pool({
    connectionString: process.env.HEROKU_POSTGRESQL_IVORY_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  await pool.connect().catch(function(err){
    console.log(err);
  });

  console.log(data);
  for (var i = 0; i < data.length; i++) {
    let curr_tweet = data[i];
    console.log(data[i]);
    await parse_indvidual_tweet(user_id, curr_tweet, last_tweet_id, pool)
  }




  // save last tweet
  return newest_id; // (you might need to store this in database???)
}


async function parse_indvidual_tweet(user_id, tweet, last_tweet_id, pool){
  if (!tweet.in_reply_to_user_id || tweet.in_reply_to_user_id == user_id){
    // if not a reply or a reply to yourself
    let tweet_id = tweet.id
    let image_bool = tweet.attachments
    let ref_bool = !tweet.referenced_tweets

    let text_to_save = tweet.text
    let referenced_tweets = []
    let referenced_media = []
    let type = 'standard'

    if (typeof(tweet.referenced_tweets) != 'undefined' ){
      return
    }

    if (typeof(tweet.attachments) != 'undefined' ){
      let str_to_toke_with = " https://t.co/"
      text_to_save = tweet.text.split(str_to_toke_with)[0]
      // deal with saving the images later
      let type = 'media'
    }
    let sql_command = 'insert into my_schema.tweets("id", text, user_id, referenced_tweets, referenced_media, username, type) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *'
    let values = [tweet_id, text_to_save, user_id, referenced_media, referenced_tweets, ACCOUNTS[user_id],type]
    pool.query(sql_command, values, (err, res) =>{
      if (err){
        console.log(err);
      }
      else {
        console.log(res.rows);
      }
    })
    // handle images


  }
}


exports.pull_timeline_outer = pull_timeline_outer;
exports.parse_tweet_object = parse_tweet_object;

// module.exports = {pull_timeline_outer};
