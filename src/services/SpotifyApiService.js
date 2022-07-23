import * as spotifyApi from "../spotify/SpotifyApi.js";
import * as jwtValidator from "../security/JwtValidator.js";
import * as dao from "../datasource.js";

const peristUser = async (spotifyToken) => {
  const userProfile = await spotifyApi.getUserSpotifyProfile(spotifyToken);
  const userTracksIds = await spotifyApi.getTopTracksId(spotifyToken);
  const userArtistIds = await spotifyApi.getTopArtistsId(spotifyToken);
  const userTracksDetails = await spotifyApi.getTracksDetails(
    userTracksIds,
    spotifyToken
  );
  dao.insertUser(userProfile, userTracksIds, userArtistIds);
  dao.insertTrackDetails(userTracksDetails);
};

const getIdBySpotifyToken = async (spotifyToken) => {
  return (await spotifyApi.getUserSpotifyProfile(token)).id;
};

const getTracksDetails = async (spotifyToken, tracks) => {
  return spotifyApi.getTracksDetails(spotifyToken, tracks);
};
