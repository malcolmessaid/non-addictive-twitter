const express = require('express')
const fetch = require('node-fetch')
const env = require('dotenv').config()
const port = process.env.PORT || 3000;

const { Client, Pool } = require('pg')
const {pool} = require('./database.js')
const {set_accounts, get_users} = require('./update_tweets.js')


async function pull_tweets(){
  set_accounts(false);
  console.log("hello");
  console.log("(pull_tweets) users:", get_users());
}

async function pull_user_tweets(user_id){
  let sql_command = `select * from my_schema.tweets where user_id = ${user_id} limit 10`
  let res = await pool.query(sql_command, [],)
    .catch((err) => console.log(err))
    .then((res) =>{
      return res.rows;
    })

  let quoted_tweets_to_pull = []
  let indexes = []
  for (var i = 0; i < res.length; i++) {
    let tweet = res[i];
    if (tweet.type.includes('quoted')){
      quoted_tweets_to_pull.push(tweet.referenced_tweets[tweet.type.indexOf('quoted')])
      indexes.push(i)
    }
  }
  let quote_sql_command = 'SELECT * FROM my_schema.tweets WHERE id = ANY($1::bigint[])'
  let quotes = await pool.query(quote_sql_command, [quoted_tweets_to_pull],)
    .catch((err) => console.log(err))
    .then((res) =>{
      return res.rows;
    })
  // console.log("(pull_user_tweets) quotes: ",quotes);
  for (var i = 0; i < quoted_tweets_to_pull.length; i++) {
    res[indexes[i]].quoted = quotes[i];
   }
   return res
}


async function pull_thread(tweet_id){
  // need to forwards and backwards. this is where neo4j would be helpful
  return -1;
}



// exports.pull_user_tweets = pull_user_tweets;
exports.pull_tweets = pull_tweets;
