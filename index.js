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

const {pull_timeline_outer, write_timeline_to_db} = require('./tweets.js');
const {sample_tweet} = require('./sample.js');

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const ACCOUNTS = {2407905670:'nathanaclark' , 293054700: 'Flav_Bateman'}
const TIMELINE_URL = `https://api.twitter.com/2/users/:id/tweets?max_results=10&expansions=attachments.media_keys,referenced_tweets.id`
const tweet_id = 1496087033093230599
app.get('/', async (req, res) =>
{
  // Pulling From Tweitter
  res.sendFile('index.html', { root: frontEndDir})

  for (var user in ACCOUNTS) {
    if (p.hasOwnProperty(user)) {
        let last_tweet_id = await get_most_recent_tweet(user);
        var response = await pull_timeline_outer(user, last_tweet_id) // Pull recent tweets
        write_timeline_to_db(user, response, last_tweet_id) // write tweets to database
    }
}


  console.log("Log from get/: ", );
})

// TODO:
/*
 1. create users-table that keeps track of most recent tweet for every user
 2. write create_user fucntuon
 3. wriet get_most_recent_tweet
 4. populate database

 5. begin writing function to send data to frontned
 6. think about cache 

*/



// CronJob to run every X-amount of time
// var job = new CronJob('*/5 * * * * *', function()
// {
//   console.log('You will see this message every 5 seconds');
// }, null, true, 'America/Los_Angeles');
