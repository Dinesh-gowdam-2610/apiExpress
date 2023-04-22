// Entry Point of the API Server
const express = require("express");
const app = express();
const Pool = require("pg").Pool;
const router = express.Router();

// const pool = new Pool({
//   user: API_USER,
//   host: API_HOST,
//   // host: API_PROD_HOST,
//   database: API_DB,
//   password: API_PASSWORD,
//   dialect: API_DEILECT,
//   port: API_PORT,
// });

const pool = new Pool({
  host: "localhost",
  user: "dinesh",
  port: 5432,
  password: "#Dineshpostgres2",
  database: "userapidetails",
  ssl: true,
});
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Connected to Database !");
  });
});

try {
  async function getAllTasks() {
    try {
      let getAllTasks = await pool.query(`SELECT * FROM createtasks`);
      if (getAllTasks && getAllTasks.rows) {
        return getAllTasks.rows;
      } else {
        return "Record Not Found";
      }
    } catch (err) {
      console.log(err); // output to netlify function log
      return {
        statusCode: 500,
        body: err.message, // Could be a custom message or object i.e. JSON.stringify(err)
      };
    }
  }

  const getAll = async () => {
    app.get("/getAllTasks", async (req, res) => {
      let getAllTask = await getAllTasks();
      res.send(getAllTask);
    });
  };
  getAll();
} catch (e) {
  console.log("error connection", e);
}

const server = app.listen(3000);
