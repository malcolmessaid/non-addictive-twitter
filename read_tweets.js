const express = require('express')
const fetch = require('node-fetch')
const env = require('dotenv').config()
const port = process.env.PORT || 3000;

const { Client, Pool } = require('pg')
const {pool} = require('./database.js')




async function pull_user_tweets(user_id){
  let sql_command = `select * from my_schema.tweets where user_id = ${user_id} limit 10`

  let res = await pool.query(sql_command, [],)
    .catch((err) => console.log(err))
    .then((res) =>{
      return res.rows;
    })

  console.log(res);

  // Loop through res. If quote tweeting or rewtweeting, get the other tweet.
  // Otherwise Save indication that there is a


}


async function pull_thread(tweet_id){
  // need to forwards and backwards. this is where neo4j would be helpful
  return -1;
}



exports.pull_user_tweets = pull_user_tweets;
