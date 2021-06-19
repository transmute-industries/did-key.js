const fastifyPlugin = require("fastify-plugin");
const { resolver } = require('@transmute/did-key.js')
const schemas = require("../schemas");

async function servicesConnector(fastify, options) {
  // TODO: use options to help with Service Constructors
  //   const url = options.url;
  //   delete options.url;
  //   const db = await MongoClient.connect(url, options);

  const services = {
    schemas: schemas,
    resolver
  };
  fastify.decorate("svcs", services);
}

// Wrapping a plugin function with fastify-plugin exposes the decorators,
// hooks, and middlewares declared inside the plugin to the parent scope.
module.exports = fastifyPlugin(servicesConnector);
