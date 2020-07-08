const functions = require("firebase-functions");
const http = require("http");

const { getFastify } = require("@transmute/did-key-fastify-resolver");

let handleRequest = null;

const serverFactory = (handler, opts) => {
  handleRequest = handler;
  return http.createServer();
};

const config = require("./config");

const opts = {
  serverFactory,
  modifyCoreObjects: false,
  config
};

const { fastify } = getFastify(opts);

// Required to support post in Cloud functions
fastify.addContentTypeParser("application/json", (req, done) => {
  // Pass req.body (parsed by the cloud function's body parser) through to the handler
  done(null, req.body);
});

exports.main = functions.https.onRequest((req, res) => {
  fastify.ready(err => {
    if (err) throw err;
    handleRequest(req, res);
  });
});
