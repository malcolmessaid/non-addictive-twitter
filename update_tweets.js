const express = require('express')
const fetch = require('node-fetch')
const env = require('dotenv').config()


// const {env} = require('./env.js');
const {sample_tweet} = require('./sample.js');
const {pool} = require('./database.js')
// const {users} = require('./users.js')

const port = process.env.PORT || 3000;

const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const frontEndDir = require('path').join(__dirname, "frontend/");
const { Client, Pool } = require('pg');
let users = {}

// console.log(users);

const Enum = {
  TWEET_COUNT_FALSE: -1,
  TWEET_COUNT_TRUE: 50,
};

async function update(){
  for (var user in users) {
    let last_tweet_id = await get_most_recent_tweet(user);
    var response = await fetch_user_timeline_from_twitter_api(user, last_tweet_id, Enum.TWEET_COUNT_FALSE)
    let newest = last_tweet_id
    if (typeof(response.data) != "undefined"){
      newest = response.data[0].id
      write_timeline_to_db(user, response, newest) // write tweets to database and write most recent tweet
    }
  }
}

/* fetch_tweet - testing function to pull JSON from Twitter api
 * id - id of tweet you want to pull
*/
async function fetch_tweet(id)
{
  const str = `https://api.twitter.com/2/tweets/${id}?tweet.fields=created_at&expansions=attachments.media_keys,referenced_tweets.id,in_reply_to_user_id`
  // const str = `https://api.twitter.com/2/tweets/` + id
  const options = {
    headers: new fetch.Headers({
        'Authorization': process.env.BEARER,
    }),
  }
  var res = await fetch(str, options).then(res => res.text())
    .then(data => {
      return JSON.parse(data)
    })
  return res;
}

/* fetch_user_timeline_from_twitter_api: Given user id, queires twitter api
 * and returns json object representing users tweets since their most recent tweet
 *   user_id: User whose timeline you are pulling
 *  last_tweet_id: most recent tweet pulled. Used to only pull tweets after this
 */
async function fetch_user_timeline_from_twitter_api(user_id, last_tweet_id, tweet_count)
{
  let str = `https://api.twitter.com/2/users/${user_id}/tweets?tweet.fields=created_at&since_id=${last_tweet_id}&expansions=attachments.media_keys,referenced_tweets.id,in_reply_to_user_id`
  if (tweet_count != -1 || last_tweet_id == -1){
    // console.log('asdfadsfadsfads');
    str = `https://api.twitter.com/2/users/${user_id}/tweets?tweet.fields=created_at&max_results=${tweet_count}&expansions=attachments.media_keys,referenced_tweets.id,in_reply_to_user_id`
  }

  res = await fetch(str,
  {
    headers: new fetch.Headers({
        'User-Agent':'art_project_2_3',
        'Authorization': process.env.BEARER,
    }),
  }).then(res => res.text())
    .then(data => {
      return JSON.parse(data)
    })
  return res
}


/* write_timeline_to_db : Parses JSON object returend by fetch_user_timeline_from_twitter_api.
 * calls parse_indvidual_tweet on each of the tweets, which writes to database
 *   user_id: User whose timeline you are pulling
 *   json: json object of tweets recieved from twitter API
 */
async function write_timeline_to_db(user_id, json, last_tweet_id){
  const data = json["data"]
  // console.log(json.meta.);
  let newest_id = last_tweet_id

  for (var i = 0; i < data.length; i++) {
    let curr_tweet = data[i];
    await parse_indvidual_tweet(user_id, curr_tweet, last_tweet_id, pool)
  }
  let sql_command = `update my_schema.users set last_tweet_pulled = ${newest_id}
                      where user_id = ${user_id}`
  pool.query(sql_command, [], (err, res) =>{
    if (err){ console.log(err); }
    else {}
  })
  return newest_id;
}


/* parse_indvidual_tweet : Called in write_timeline_to_db. Writes individual
* tweets to Database. Parses what type of tweet and writes fields accordingly
 *   user_id: User whose timeline you are pulling
 *   tweet: json object of tweet recieved from twitter API
 *   last_tweet_id: most recent tweet pulled. Used to only pull tweets after this
 *   pool: database connection
 */
 // TODO: change name from parse to write to db
async function parse_indvidual_tweet(user_id, tweet, last_tweet_id, pool){
  // if not a reply OR a reply to yourself
  // console.log('(parse_indvidual_tweet) tweet.in_reply_to_user_id: ', tweet.in_reply_to_user_id);
  if (!tweet.in_reply_to_user_id || tweet.in_reply_to_user_id == user_id){
    let tweet_id = tweet.id
    let image_bool = tweet.attachments
    let text_to_save = tweet.text
    let referenced_tweets = []
    let referenced_media = []
    let reference_type = []
    let datetime = tweet.created_at;
    if (typeof(tweet.in_reply_to_user_id) != 'undefined' ){
      for (var i = 0; i < tweet.referenced_tweets.length; i++) {
        referenced_tweets.push(tweet.referenced_tweets[i]['id'])
        reference_type.push(tweet.referenced_tweets[i]['type'])
        //TODO: fetch and process refereced tweets

        let ref_tweet = await fetch_tweet(tweet.referenced_tweets[i]['id']);
        // console.log("(parse_indvidual_tweet) tweet_id",tweet_id);
        await parse_indvidual_tweet(user_id, ref_tweet.data, -1, pool)


        // console.log(ref_tweet);
        // parse_indvidual_tweet()
      }
    }
    else if (typeof(tweet.referenced_tweets) != 'undefined' ){
      for (var i = 0; i < tweet.referenced_tweets.length; i++) {
        referenced_tweets.push(tweet.referenced_tweets[i]['id'])
        reference_type.push(tweet.referenced_tweets[i]['type'])
        //TODO: fetch and process refereced tweets
      }
    }

    if (typeof(tweet.attachments) != 'undefined' ){
      let str_to_toke_with = " https://t.co/"
      text_to_save = tweet.text.split(str_to_toke_with)[0]
      // deal with saving the images later
      referenced_media = tweet.attachments.media_keys
    }
    let sql_command = 'insert into my_schema.tweets("id", text, user_id, referenced_tweets, referenced_media, username, type, datetime) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *'
    // set username to accoubts. if does not exist. pull from twitter api?
    let values = [tweet_id, text_to_save, user_id, referenced_tweets, referenced_media, users[user_id.toString()],reference_type, datetime]
    console.log("values", values);
    pool.query(sql_command, values, (err, res) =>{
      if (err){ console.log(err);}
      else {}
    })
  }
  else
  {
    console.log("parse_indvidual_tweet: not storing tweet because it is a reply")
  }
}


async function set_accounts(){
  // set accounts from users table
  let sql_command = `select username, user_id from my_schema.users`
  await pool
    .query(sql_command, [],)
    .catch((err) => {
      console.log('Error Pulling Username List');
    })
    .then(res => {
      res = res.rows;
      let temp = {}
      for (var i = 0; i < res.length; i++) {
        temp[res[i].user_id] = res[i].username
      }
      users = temp
      console.log('asdfad');
      // console.log('user/');
    })
}

async function get_most_recent_tweet(user_id){
  // pull from users table
  let command = `select last_tweet_pulled from my_schema.users
                where user_id = ${user_id}`
  let res = await pool.query(command, [],)
    .catch((err) => console.log("Error get_most_recent_tweet: issue pulling most recent tweet"))
    .then((res) => {
      return res.rows[0].last_tweet_pulled;
    })
  return res;
}


/*
Pulls images from API and stores in S3 and link to S3 in postgres
*/
async function store_media(user_id, tweet, last_tweet_id, pool){

}

set_accounts();

exports.fetch_user_timeline_from_twitter_api = fetch_user_timeline_from_twitter_api;
exports.write_timeline_to_db = write_timeline_to_db;
exports.set_accounts = set_accounts;
exports.update = update;
exports.users = users;
exports.fetch_tweet = fetch_tweet;
exports.parse_indvidual_tweet = parse_indvidual_tweet;
