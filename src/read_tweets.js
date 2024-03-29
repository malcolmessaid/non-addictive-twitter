const express = require('express')
const fetch = require('node-fetch')
const env = require('dotenv').config()
const port = process.env.PORT || 3000;

const { Client, Pool } = require('pg')
const {pool} = require('./database.js')
const {set_accounts, get_users} = require('./update_tweets.js')


async function pull_tweets(){
  set_accounts(false);
  let temp_users = get_users();
  let res = {}
  for (var user_id in temp_users) {
    res[temp_users[user_id]] = await pull_user_tweets(user_id, 10)
  }
  return res
}



async function pull_user_tweets(user_id, tweet_count){
  let sql_command = `select * from my_schema.tweets where user_id = ${user_id}
      order by datetime desc
      limit ${tweet_count} `
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

  // this is annoying
  let quote_sql_command = 'SELECT * FROM my_schema.tweets WHERE id = ANY($1::bigint[])'
  let quotes = await pool.query(quote_sql_command, [quoted_tweets_to_pull],)
    .catch((err) => console.log(err))
    .then((res) =>{
      // console.log(res.rows);
      return res.rows;
    })
  // console.log(quoted_tweets_to_pull);
  for (var i = 0; i < res.length; i++) {
    // console.log(quotes);
    // console.log("indexes", indexes);
    if (indexes.includes(i)){
      let temp = quoted_tweets_to_pull[indexes.indexOf(i)]
      // console.log(temp);
      for (var j = 0; j < quotes.length; j++) {
        if (quotes[j].id == temp){
            res[i].quoted = quotes[j];
        }
      }

    }
    else {
      res[i].quoted = {};
    }

   }
   return res
}


async function pull_thread(tweet_id){
  // need to forwards and backwards. this is where neo4j would be helpful
  return -1;
}



// exports.pull_user_tweets = pull_user_tweets;
exports.pull_tweets = pull_tweets;
exports.pull_user_tweets = pull_user_tweets;
