// DATABASE CODE
const { Client } = require('pg');
require('dotenv').config();



console.log("database.js", process.env.NODE_ENV);



/*
  Empties Dev database for Devlepnent Purposes
*/
if (process.env.NODE_ENV == 'DEV'){
  console.log("database.js", process.env.HEROKU_POSTGRESQL_IVORY_URL);
  const client = new Client({
    connectionString: process.env.HEROKU_POSTGRESQL_IVORY_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });


  client.connect().catch(function(err){
    console.log(err);
  });

  client.query('TRUNCATE TABLE my_schema.tweets;', (err, res) => {
    if (err){
      console.log(err);
      throw err;

    }
    client.end();
  });
}
