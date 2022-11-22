const express = require('express')
const fetch = require('node-fetch')
const env = require('dotenv').config()

const app = express()
const schedule = require('node-schedule');
const CronJob = require('cron').CronJob;

// const {env} = require('./env.js');
const port = process.env.PORT || 3000;

const path = require('path');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const frontEndDir = require('path').join(__dirname, "frontend/");


const { Client, Pool } = require('pg');
const {update, fetch_tweet, parse_indvidual_tweet, get_users} = require('./update_tweets.js');
const {create_user} = require('./users.js')
const {pool} = require('./database.js')
const {pull_tweets, pull_user_tweets} = require('./read_tweets.js')

function test_users_scope(){
  console.log("1. users: ", get_users());
  update()
  console.log("2. users: ", get_users());
  pull_tweets()
  console.log("3. users: ", get_users());
}


async function test_pulling_thread(id, user_id){
  let temp = await fetch_tweet(id);
  parse_indvidual_tweet(user_id, temp.data, -1, pool)
}
