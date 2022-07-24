import * as userService from "../services/UserService.js";
import express from "express";
const router = express.Router();

router.get("/profile", async (req, res) => {
  const user = await userService.getUserSpotifyProfile(req.headers.jwt);
  res.send(user);
});

router.get("/match", async (req, res) => {
  const matches = await userService.match(req.headers.jwt);
  res.send(matches);
});

router.get("/tracks", async (req, res) => {
  const tracks = await userService.getTracksDetails(req.headers.jwt);
  res.send(tracks);
});

router.get("/matches", async (req, res) => {
  const matches = await userService.getMatches(req.headers.jwt);
  res.send(matches);
});

router.post("/bio", async (req, res) => {
  userService.setBiography(req.headers.jwt, req.body);
  res.send();
});

export default router;
