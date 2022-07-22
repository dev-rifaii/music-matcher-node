import pg from "pg";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const client = new pg.Client(process.env.DATABASE_URL);

client.connect((error) => {
  console.log("connected");
  if (error) {
    console.log(error);
  }
});

const getUserById = async (id) => {
  const res = await client.query(
    "SELECT * FROM application_users WHERE id = $1",
    [id]
  );
  return res.rows[0];
};

const insertUser = (user, tracks, artists) => {
  client.query(
    "INSERT INTO application_users (id, country, email, image) VALUES($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET id=$1, country=$2, email=$3, image=$4",
    [user.id, user.country, user.email, user.image]
  );
  client.query("DELETE FROM user_top_tracks WHERE user_id=$1", [user.id]);

  tracks.forEach((track) => {
    client.query(
      "INSERT INTO user_top_tracks (user_id, track_id) VALUES($1, $2)",
      [user.id, track]
    );
  });
  client.query("DELETE FROM user_top_artists WHERE user_id=$1", [user.id]);

  artists.forEach((artist) => {
    client.query(
      "INSERT INTO user_top_artists (user_id, artist_id) VALUES($1, $2)",
      [user.id, artist]
    );
  });
};

const getTopTracksByUserId = async (id) => {
  const res = await client.query(
    "SELECT track_id FROM user_top_tracks WHERE user_id=$1",
    [id]
  );

  return res.rows;
};

const getTopArtistsByUserId = async (id) => {
  const res = await client.query(
    "SELECT arist_id FROM user_top_artists WHERE user_id=$1",
    [id]
  );
  return res.rows;
};

const insertMatch = (userId, matchId) => {
  client.query("INSERT INTO matches (user_id, match) VALUES ($1, $2)", [
    userId,
    matchId,
  ]);
};

const getMatchesByUserId = async (id) => {
  const res = await client.query("SELECT match FROM matches WHERE user_id=$1", [
    id,
  ]);
  return res.rows;
};

const insertTrackDetails = (tracks) => {
  tracks.forEach((track) => {
    client.query(
      "INSERT INTO track_details (id, name, href, image_url) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
      [track.id, track.name, track.href, track.image_url]
    );
  });
};

const getTrackDetailsByTrackId = async (id) => {
  const res = await client.query("SELECT * FROM track_details WHERE id=$1", [
    id,
  ]);
  return res.rows;
};

const updateUserBiography = (id, text) => {
  client.query("UPDATE application_users SET biography=$2 WHERE id=$1", [
    id,
    text,
  ]);
};

const matchUser = async (id, amountOfTracks) => {
  const res = await client.query(
    `SELECT * from application_users where id IN (
      SELECT that.user_id FROM user_top_tracks AS this INNER JOIN user_top_tracks
      AS that ON that.user_id <> this.user_id 
      AND that.track_id = this.track_id WHERE this.user_id = $1 
      GROUP BY that.user_id HAVING COUNT(*) >= $2 )`,
    [id, amountOfTracks]
  );

  return res.rows;
};

export {
  insertUser,
  insertTrackDetails,
  insertMatch,
  getUserById,
  getMatchesByUserId,
  getTrackDetailsByTrackId,
  getTopTracksByUserId,
  getTopArtistsByUserId,
  matchUser,
  updateUserBiography,
};
