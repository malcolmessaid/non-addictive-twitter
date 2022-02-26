const express = require('express')
const fetch = require('node-fetch')
const app = express()
const schedule = require('node-schedule');
const CronJob = require('cron').CronJob;
const {env} = require('./env.js');
const port = 3000

const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const frontEndDir = require('path').join(__dirname, "frontend/");

// TODO: FIGURE OUT HOW TO AUTHROZIE FETCH REQUEST TO TWITTER

const ACCOUNTS = {'nathanaclark': 2407905670}
const TIMELINE_URL = `https://api.twitter.com/2/users/:id/tweets?max_results=10&expansions=attachments.media_keys,referenced_tweets.id`


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



const tweet_id = 1496087033093230599
app.get('/', async (req, res) =>
{

  // Pulling From Tweitter
  res.sendFile('index.html', { root: frontEndDir})
  var response = await pull_timeline_outer(2407905670) // Pull recent tweets
  // TODO: PARSE RESPOSNE
      // check if references tweet
      // check if referenced tweet are in database
  // TODO: CEHCK WHICH WARE NEW (Have api rquest for latestest )
  // TODO:  SEND NEW
  // console.log(response);
  console.log(response.includes);

  // Loading into my Database/chekcing agsint my database
  // Load from my databsase the most recent
  // from express laoding data for user
})



// CronJob to run every X-amount of time
// var job = new CronJob('*/5 * * * * *', function()
// {
//   console.log('You will see this message every 5 seconds');
// }, null, true, 'America/Los_Angeles');




// Pulls recent tweets from given user
async function pull_tweet(id)
{
  const str = `https://api.twitter.com/2/tweets/1496087033093230599`
  console.log(str);
  const options = {
    headers: new fetch.Headers({
        'Authorization': env.bearer,
    }),
  }
  var res = await fetch(str, options).then(res => res.text())
    .then(data => {
      return JSON.parse(data)
    })
}


// Pulls recent tweets from given user
async function pull_timeline_outer(id)
{
  const str = `https://api.twitter.com/2/users/${id}/tweets?max_results=10&expansions=attachments.media_keys,referenced_tweets.id`
  res = await fetch(str,
  {
    headers: new fetch.Headers({
        'User-Agent':'art_project_2_3',
        'Authorization': env.bearer,
    }),
  }).then(res => res.text())
    .then(data => {
      return JSON.parse(data)
    })
  return res

}
