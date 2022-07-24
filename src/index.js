import auth from "./routes/Authorization.js";
import user from "./routes/User.js";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const PREFIX = "/spotifymatcher";

app.use(cors());
app.use(express.text());

app.use(`${PREFIX}/authentication`, auth);
app.use(`${PREFIX}/users`, user);

app.listen(1000, () => {
  console.log("Server started");
});
