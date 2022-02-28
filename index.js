const express = require('express')
const fetch = require('node-fetch')


const app = express()
const schedule = require('node-schedule');
const CronJob = require('cron').CronJob;
const {env} = require('./env.js');
const port = process.env.PORT || 5000;

const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const frontEndDir = require('path').join(__dirname, "frontend/");
const { Client, Pool } = require('pg');

const {pull_timeline_outer, parse_tweet_object} = require('./tweets.js');
const {sample_tweet} = require('./sample.js');

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// console.log();


// DATABASE CODE
// console.log("url", process.env.HEROKU_POSTGRESQL_IVORY_URL);
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






const ACCOUNTS = {2407905670:'nathanaclark' , 293054700: 'Flav_Bateman'}
const TIMELINE_URL = `https://api.twitter.com/2/users/:id/tweets?max_results=10&expansions=attachments.media_keys,referenced_tweets.id`
const tweet_id = 1496087033093230599
app.get('/', async (req, res) =>
{
  // Pulling From Tweitter
  res.sendFile('index.html', { root: frontEndDir})
  var response = await pull_timeline_outer(293054700, 1496877395483279363) // Pull recent tweets

  console.log(parse_tweet_object(293054700, sample_tweet, 1496877395483279363));
  // TODO: PARSE RESPOSNE
      // check if references tweet
      // check if referenced tweet are in database
  // TODO: CEHCK WHICH WARE NEW (Have api rquest for latestest )
  // TODO:  SEND NEW
  // console.log(response);
  // console.log(response);

  // Loading into my Database/chekcing agsint my database
  // Load from my databsase the most recent
  // from express laoding data for user
})


// CronJob to run every X-amount of time
// var job = new CronJob('*/5 * * * * *', function()
// {
//   console.log('You will see this message every 5 seconds');
// }, null, true, 'America/Los_Angeles');
