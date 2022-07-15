import pg from "pg";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });


const client = new pg.Client(process.env.DB_URL);

client.connect((error) => {
  if (error) {
    console.log(error);
  }
});

client.query("SELECT * FROM application_users", (err, res) => {
  if (err) {
    console.log("Query failed");
  } else {
    res.rows.forEach((element) => {
      console.log(element);
    });
  }
});
