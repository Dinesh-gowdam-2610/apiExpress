const { Client } = require("pg");

const client = new Client({
  host: "dpg-cgpd6i5269v5rjetmpn0-a.singapore-postgres.render.com",
  user: "dinesh",
  port: 5432,
  password: "AdCNGH6Upy9UXqhDM2oSBRrHklEnTCxX",
  database: "userapidetails_lagy",
  ssl: true,
});
// const client = new Client({
//   host: "localhost",
//   user: "dinesh",
//   port: 5432,
//   password: "#DineshPostgres2",
//   database: "userapidetails",
// });

client.connect();
// client.query("SET search_path TO 'userapidetails';");

client.query("select * from createapidetails", (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log("error", err);
  }
  client.end();
});
