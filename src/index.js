import auth from "./routes/Authorization.js";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use("/spotifymatcher/authentication", auth);

app.listen(1000, () => {
  console.log("server started on 1000");
});
