// Entry Point of the API Server
const express = require('express');

const app = express();
const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'apiexpress',
  host: 'dpg-cem2eg5a4991ihktm650-a.singapore-postgres.render.com',
  database: 'apiexpress',
  password: 'MwthgagVBBOrDn6pOvJLNqiEB9HfNq2D',
  dialect: 'postgres',
  port: 5432,
  ssl: true
});

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


pool.connect((err, client, release) => {
  if (err) {
    return console.error(
      'Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error(
        'Error executing query', err.stack)
    }
    console.log("Connected to Database !")
  })
})

app.get('/', (req, res) => {
  // pool.query('SELECT * FROM users', (err, result) => {
  //   if (err) throw err;
  res.send("Hello from database");
  // });
});


const server = app.listen(3000)