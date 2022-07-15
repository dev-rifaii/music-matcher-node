import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://accounts.spotify.com";
const SCOPE = "user-read-private user-read-email user-top-read";
const REDIRECT = "/callback";

let getAuthenticationUrl = (clientBaseRoute) => {
  const authenticationUrl = new URL(`${BASE_URL}/authorize`);
  authenticationUrl.searchParams.append("client_id", process.env.CLIENT_ID);
  authenticationUrl.searchParams.append("response_type", "code");
  authenticationUrl.searchParams.append(
    "redirect_uri",
    clientBaseRoute + REDIRECT
  );
  authenticationUrl.searchParams.append("scope", SCOPE);
  return authenticationUrl.toString();
};

let getToken = async (code, clientBaseRoute) => {
  const req = axios
    .post(`${BASE_URL}/api/token`, null, {
      headers: {
        Authorization: `Basic ${getEncodedSpotifyAppCredentials()}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        code: code,
        redirect_uri: clientBaseRoute + REDIRECT,
        grant_type: "authorization_code",
      },
    })
    .catch((error) => {
      console.log(error.response.data);
    });

  const response = await req;

  const token = response.data;
  reformToken(token);
  return token;
};

let refreshToken = async (refreshToken) => {
  let req = axios
    .post(`${BASE_URL}/api/token`, null, {
      headers: {
        Authorization: `Basic ${getEncodedSpotifyAppCredentials()}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      },
    })
    .catch((error) => {
      console.log(error.response);
    });

  const response = await req;

  const token = response.data;
  reformToken(token);
  token.refresh_token = refreshToken;
  return token;
};

let reformToken = (token) => {
  delete token.scope;
  delete token.expires_in;
  delete token.token_type;
  token.expires_at = new Date().getTime() + 3600 * 1000;
  return token;
};

let getEncodedSpotifyAppCredentials = () => {
  const authorizationHeader = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
  return btoa(authorizationHeader);
};

export { getAuthenticationUrl, getToken, refreshToken };
