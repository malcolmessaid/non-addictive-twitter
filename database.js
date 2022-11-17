const express = require('express')
const fetch = require('node-fetch')
const env = require('dotenv').config()
const port = process.env.PORT || 3000;

const { dirname } = require('path');
const { Client, Pool } = require('pg');
// const {fetch_user_timeline_from_twitter_api, write_timeline_to_db,} = require('./update_tweets.js');

const pool = new Pool({
  connectionString: process.env.HEROKU_POSTGRESQL_IVORY_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

exports.pool = pool;

//
// /*
//   Empties Dev database for Devlepnent Purposes
// */
// if (process.env.NODE_ENV == 'DEV'){
//   console.log("database.js", process.env.HEROKU_POSTGRESQL_IVORY_URL);
//   const client = new Client({
//     connectionString: process.env.HEROKU_POSTGRESQL_IVORY_URL,
//     ssl: {
//       rejectUnauthorized: false
//     }
//   });
//
//
//   client.connect().catch(function(err){
//     console.log(err);
//   });
//
//   client.query('TRUNCATE TABLE my_schema.tweets;', (err, res) => {
//     if (err){
//       console.log(err);
//       throw err;
//
//     }
//     client.end();
//   });
// }
