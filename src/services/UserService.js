import * as spotifyApi from "../spotify/SpotifyApi.js";
import * as jwtValidator from "../security/JwtValidator.js";
import * as dao from "../datasource.js";

const getUserSpotifyProfile = async (jwt) => {
  if ((await jwtValidator.verifyToken(jwt)) == true) {
    return await dao.getUserById(await jwtValidator.getUserId(jwt));
  }
};

console.log(await getUserSpotifyProfile(jwt));
