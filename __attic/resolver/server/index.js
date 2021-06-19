const { getFastify } = require("../src");

const config = require("./config");

const opts = {
  logger: config.fastifyLogger === "true",
  config
};

const { fastify } = getFastify(opts);

fastify.listen(config.port, "0.0.0.0", (err, address) => {
  if (err) throw err;
  fastify.log.info(`server listening on ${address}`);
});

module.exports = fastify;
