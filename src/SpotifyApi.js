import axios from "axios";

const BASE_URL = "https://api.spotify.com/v1";

let getUserSpotifyProfile = async (token) => {
  const profile = await fetchFromApi(`${BASE_URL}/me`, token);
  const user = {
    id: profile.id,
    country: profile.country,
    email: profile.email,
    image: profile.images[0].url,
  };
  return user;
};

let fetchFromApi = async (url, token) => {
  const req = axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const response = await req;
  return response.data;
};
