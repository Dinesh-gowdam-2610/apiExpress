const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "#DineshPostgres2",
  database: "postgres",
});
client.connect();

client.query(`select * from createtasks`, (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log("error");
  }
  client.end();
});
