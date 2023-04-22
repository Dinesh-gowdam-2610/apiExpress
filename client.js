const pg = require("pg");

// const cs =
//   "postgres://postgres:password@anydb.rds.amazonaws.com:5432/subnet_calculator";

const cs = "postgresql://localhost:5432/userapidetails";
const client = new pg.Client(cs);
client.connect();

client.query("SELECT * FROM createapidetails", function (result) {
  console.log(result);
});
