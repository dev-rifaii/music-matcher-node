import auth from "./routes/Authorization.js";
import user from "./routes/User.js";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use("/spotifymatcher/authentication", auth);
app.use("/spotifymatcher/users", user);

app.listen(1000, () => {
  console.log("Server started");
});
