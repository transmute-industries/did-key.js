const functions = require("firebase-functions");
const http = require("http");

const { getFastify } = require("./src/index");

let handleRequest = null;

const serverFactory = (handler, opts) => {
  handleRequest = handler;
  return http.createServer();
};

const config = require("./config");

const opts = {
  serverFactory,
  modifyCoreObjects: false,
  config,
};

const { fastify } = getFastify(opts);

exports.main = functions.https.onRequest((req, res) => {
  fastify.ready((err) => {
    if (err) throw err;
    handleRequest(req, res);
  });
});
