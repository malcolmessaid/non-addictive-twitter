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
const {update, users, fetch_tweet, parse_indvidual_tweet} = require('./update_tweets.js');
const {create_user} = require('./users.js')
const {pool} = require('./database.js')
const {pull_user_tweets} = require('./read_tweets.js')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/', async (req, res) =>
{
  // Pulling From Tweitter
  res.sendFile('index.html', { root: frontEndDir})
  // get_tweets()
  // update()
  // pull_user_tweets(18989355)

  pull_user_tweets('1495841608863862786')


  console.log("Log from get/: ", );
})


async function test_pulling_thread(id, user_id){
  let temp = await fetch_tweet(id);
  parse_indvidual_tweet(user_id, temp.data, -1, pool)
}

//
// app.post('/createuser', async (req, res) =>{
//   create_user()

// })
//
// app.get('/refresh', async(req, res) =>{
//   update();
// })

// CronJob to run every X-amount of time
// var job = new CronJob('*/30 * * * * *', function()
// {
//   update()
//   console.log('You will see this message every 30 seconds');
// }, null, true, 'America/Los_Angeles');
