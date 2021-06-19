const functions = require("firebase-functions");

const firebaseConfig = functions.config().did_key;

module.exports = {
  serverEnv: firebaseConfig.server_env,
  baseUrl: firebaseConfig.base_url
};
