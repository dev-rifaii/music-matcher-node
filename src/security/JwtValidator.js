import jose from "node-jose";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const keyStore = jose.JWK.createKeyStore();

const verifyToken = async (jwt) => {
  try {
    jose.JWS.createVerify(await getKeyStore()).verify(jwt);
    return true;
  } catch (e) {
    return false;
  }
};

const getUserId = async (jwt) => {
  const res = await jose.JWS.createVerify(await getKeyStore()).verify(jwt);
  let buffer = Buffer.from(res.payload);
  return JSON.parse(buffer.toString()).user_id;
};

const fetchKey = async () => {
  let key = await (
    await axios.get(`${process.env.AUTH_SERVER_URL}/api/key`)
  ).data;
  return key;
};

const getKeyStore = async () => {
  if (keyStore.all().length == 0) {
    await keyStore.add(await fetchKey(), "pem");
  }
  return keyStore;
};

console.log(await getUserId(jwt));

export { verifyToken, getUserId };
