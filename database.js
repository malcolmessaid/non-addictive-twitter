// DATABASE CODE
const { Client } = require('pg');

// console.log("url", process.env.HEROKU_POSTGRESQL_IVORY_URL);
const client = new Client({
  connectionString: process.env.HEROKU_POSTGRESQL_IVORY_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


client.connect().catch(function(err){
  console.log(err);
});


// console.log(client);
client.query('select * from my_schema.tweets;', (err, res) => {
  if (err){
    console.log(err);
    throw err;

  }
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});
