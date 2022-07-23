import express from "express";
const router = express.Router();
import * as auth from "../spotify/SpotifyAuthorization.js";
import { getUserSpotifyProfile } from "../spotify/SpotifyApi.js";

router.get("/url", (req, res) => {
  res.send(auth.getAuthenticationUrl(req.headers.baseroute));
});

router.get("/token", async (req, res) => {
  const token = await auth.getToken(req.headers.code, req.headers.baseroute);
  res.send(token);
});

router.get("/refresh", (req, res) => {
  res.send(auth.refreshToken(req.headers.refreshtoken));
});

router.post("/persist", async (req, res) => {
  const user = await getUserSpotifyProfile(req.headers.token);
  res.send();
});

router.get("/id", async (req, res) => {
  const user = await getUserSpotifyProfile(req.headers.token);
  res.send(user.id);
});

export default router;
