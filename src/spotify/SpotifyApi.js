import axios from "axios";

const BASE_URL = "https://api.spotify.com/v1";

const getUserSpotifyProfile = async (token) => {
  const profile = await fetchFromApi(`${BASE_URL}/me`, token);
  const user = {
    id: profile.id,
    country: profile.country,
    email: profile.email,
    image: profile.images[0].url,
  };
  return user;
};

const getTopTracksId = async (token) => {
  const response = await fetchFromApi(`${BASE_URL}/me/top/tracks`, token);
  const tracks = [];

  response.items.forEach((track) => {
    tracks.push(track.id);
  });

  return tracks;
};

const getTopArtistsId = async (token) => {
  const response = await fetchFromApi(`${BASE_URL}/me/top/artists`, token);
  const artists = [];

  response.items.forEach((artist) => {
    artists.push(artist.id);
  });

  return artists;
};

const getTracksDetails = async (tracksIds, token) => {
  const joined = tracksIds.join(",");
  const response = await fetchFromApi(
    `${BASE_URL}/tracks/?ids=${joined}`,
    token
  );

  const tracks = [];

  response.tracks.forEach((track) => {
    tracks.push({
      id: track.id,
      name: track.name,
      href: track.external_urls.spotify,
      image_url: track.album.images[0].url,
    });
  });

  return tracks;
};

const fetchFromApi = async (url, token) => {
  const req = axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const response = await req;
  return response.data;
};

export {
  getUserSpotifyProfile,
  getTopArtistsId,
  getTopTracksId,
  getTracksDetails,
};
