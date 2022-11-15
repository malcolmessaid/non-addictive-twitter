const express = require('express')
const fetch = require('node-fetch')
const env = require('dotenv').config()
const port = process.env.PORT || 3000;

const { Client, Pool } = require('pg')
const {pool} = require('./database.js')
const {pull_user_timeline_from_twitter_api, write_timeline_to_db} = require('./tweets.js');

/* create_user : Adds new user to user table, and populates tweets database accordingly
 *   username: User whose timeline you are pulling
 */
async function create_user(username){
  let api_string = "https://api.twitter.com/2/users/by/username/" + username
  res = await fetch(api_string,{
    headers: new fetch.Headers({
        'User-Agent':'art_project_2_3',
        'Authorization': process.env.BEARER,
    }),
  }).then(res => res.text())
    .then(data => {
      return JSON.parse(data)
    })

    let user_id = res.data.id;
    console.log(user_id);
    let sql_command =
    ` insert into my_schema.users(user_id, username, last_tweet_pulled, last_tweet_seen_by_user)
      VALUES($1, $2, $3, $4) RETURNING *
    `
    let values = [user_id, username, -1, -1]
    pool.query(sql_command, values, (err, res) =>{
      if (err){ console.log('User ID already exists in database'); }
      else { console.log(res.rows);}
    })

    let timeline_object = await pull_user_timeline_from_twitter_api(user_id, -1 , 50)
    // console.log("create_user: ", timeline_object);
    write_timeline_to_db(user_id, timeline_object, -1)

}

exports.create_user = create_user;
