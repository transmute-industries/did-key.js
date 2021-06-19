const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../example.env") });
module.exports = {
  port: process.env.PORT,
  fastifyLogger: true,
  serverEnv: process.env.SERVER_ENV,
  baseUrl: process.env.BASE_URL
};
