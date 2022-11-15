const express = require('express')
const fetch = require('node-fetch')
const env = require('dotenv').config()

const app = express()
const schedule = require('node-schedule');
const CronJob = require('cron').CronJob;

// const {env} = require('./env.js');
const port = process.env.PORT || 3000;

const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const frontEndDir = require('path').join(__dirname, "frontend/");
const { Client, Pool } = require('pg');
const {update, users} = require('./tweets.js');
const {create_user} = require('./users.js')
const {pool} = require('./database.js')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const TIMELINE_URL = `https://api.twitter.com/2/users/:id/tweets?max_results=10&expansions=attachments.media_keys,referenced_tweets.id`
const tweet_id = 1496087033093230599
app.get('/', async (req, res) =>
{
  // Pulling From Tweitter
  res.sendFile('index.html', { root: frontEndDir})
  // get_tweets()
  // update()
  create_user('elonmusk')
  // create_user('AccountMalcolm')
  // create_user('micsolana')
  // create_user('theextrainch')
  // create_user('hbrooks_coach')
setTimeout(function () {
console.log(users);
}, 1000);

  // create_user('AccountMalcolm')

  // create_user('micsolana')
  // create_user('theextrainch')
  // create_user('hbrooks_coach')
  // update()
  console.log("Log from get/: ", );
})

//
// app.post('/createuser', async (req, res) =>{
//   create_user()

// })
//
// app.get('/refresh', async(req, res) =>{
//   update();
// })

// TODO:
/*
1. Build Update Function
2. Build Get_tweets function



//
//  1. create users-table that keeps track of most recent tweet for every user
//  2. write create_user fucntuon
//  3. write get_most_recent_tweet
//  4. populate database
//
//
//  5. begin writing function to send data to frontned
//     5.a. get tweets functions
//     5.b  check cache
//  6. think about cache
//  7. Need a better way to store which accounts are being processed
//  8. tweets should really have a date_time column
// */



// CronJob to run every X-amount of time
// var job = new CronJob('*/30 * * * * *', function()
// {
//   update()
//   console.log('You will see this message every 30 seconds');
// }, null, true, 'America/Los_Angeles');
