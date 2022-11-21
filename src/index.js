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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/', async (req, res) =>
{
  // Pulling From Tweitter
  console.log(frontEndDir);
  // res.sendF/ile('./index.html', { root: "frontend/"})
  // update();
  console.log("Log from get/: ", );
})


app.get('/tweets', async (req, res) => {
  // res.sendFile('index.html', { root: frontEndDir})
  // res.json({'malcolm' : 'essaid'})
  // console.log("hekklio");
  res.json(await pull_tweets())
})

app.get('/usertweets', async (req, res) => {
  // TODO: WROTE ON PLANE, NEED TO TEST
  // res.sendFile('index.html', { root: frontEndDir})
  let temp = await pull_user_tweets(req.query.userid, req.query.count)
  // console.log(temp);
  res.json(temp)
})

app.get('/userlist', async (req, res) => {
  res.json(get_users())
})

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
