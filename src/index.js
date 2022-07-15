import auth from "./Authorization.js";
import express from "express";

const app = express();

app.use("/auth", auth);

app.listen(1000, () => {
  console.log("server started on 1000");
});
