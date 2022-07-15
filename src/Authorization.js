import express from "express";
const router = express.Router();
import * as auth from "./SpotifyAuthorization.js";

router.get("/url", (req, res) => {
  res.send(auth.getAuthenticationUrl(req.headers.baseroute));
});

router.get("/token", (req, res) => {
  res.send(auth.getToken(req.headers.code, req.headers.baseroute));
});

router.get("/refresh", (req, res) => {
  res.send(auth.refreshToken(req.headers.refreshtoken));
});
export default router;
