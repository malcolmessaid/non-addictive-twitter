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
