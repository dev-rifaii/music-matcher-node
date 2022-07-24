import * as spotifyApi from "../spotify/SpotifyApi.js";
import * as jwtValidator from "../security/JwtValidator.js";
import * as dao from "../datasource.js";

const match = async (jwt) => {
  if ((await jwtValidator.verifyToken(jwt)) == true) {
    const userId = await jwtValidator.getUserId(jwt);
    const user = await dao.getUserById(userId);
    const previousMatches = await dao.getMatchesByUserId(userId);
    const newMatches = filterMatches(
      user,
      previousMatches,
      await dao.matchUser(userId)
    );
    if (user.biography == null) {
      return null;
    }
    if (newMatches.length > 0) {
      persistMatches(userId, newMatches);
      return newMatches;
    }
    return [];
  }
};

const getUserSpotifyProfile = async (jwt) => {
  if ((await jwtValidator.verifyToken(jwt)) == true) {
    return await dao.getUserById(await jwtValidator.getUserId(jwt));
  }
};

const setBiography = async (jwt, text) => {
  if ((await jwtValidator.verifyToken(jwt)) == true) {
    if (text.length > 10) {
      dao.updateUserBiography(await jwtValidator.getUserId(jwt), text);
      return true;
    }
    return false;
  }
};

const getMatches = async (jwt) => {
  if ((await jwtValidator.verifyToken(jwt)) == true) {
    return await dao.getMatchesByUserId(await jwtValidator.getUserId(jwt));
  }
};
const getTracksDetails = async (jwt) => {
  if ((await jwtValidator.verifyToken(jwt)) == true) {
    const userId = await jwtValidator.getUserId(jwt);
    const tracks = await dao.getTopTracksByUserId(userId);
    const detailedTracks = [];
    await Promise.all(
      tracks.map(async (track) => {
        detailedTracks.push(await dao.getTrackDetailsByTrackId(track.track_id));
      })
    );

    const modifiedArray = detailedTracks.map(
      ({ image_url: imageUrl, ...rest }) => ({
        imageUrl,
        ...rest,
      })
    );

    return modifiedArray;
  }
};
const filterMatches = async (user, previousMatches, newMatches) => {
  const filteredMatches = [];
  newMatches.forEach(async (match) => {
    const matchProfile = await dao.getUserById(match);
    if (matchProfile.biography != null && !previousMatches.includes(match)) {
      filteredMatches.push(match);
    }
  });
  return filteredMatches;
};

const persistMatches = (userId, matches) => {
  matches.forEach((match) => {
    dao.insertMatch(userId, match);
    dao.insertMatch(match, userId);
  });
};

export {
  match,
  getMatches,
  getUserSpotifyProfile,
  getTracksDetails,
  setBiography,
};
