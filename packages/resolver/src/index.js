/* eslint-disable global-require */
const fastify = require("fastify");
const fastifySwagger = require("fastify-swagger");

const getFastify = opts => {
  const app = fastify({
    ...opts,
    ignoreTrailingSlash: true,
    maxParamLength: 200,
  });

  app.register(require("./services/services-connector"), {
    baseUrl: opts.config.baseUrl
  });

  // Swagger must be registered before the routes
  app.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'DID Key Resolver',
        description:
          "`did:key` is a [DID Method](https://w3c.github.io/did-core/) which is offline friendly, cryptographically self certifying, requires no trust of blockchain or certificate authoritites and is ideal for ephemeral use.",
        version: '0.0.0',
        license: {
          name: 'Source Code',
          url: 'https://github.com/transmute-industries/did-key.js',
        },
        contact: {
          name: 'Demo',
          url: 'https://did-key.web.app',
        },
      },

    },
    exposeRoute: true,
    routePrefix: "api/docs"
  });

  // Enable CORS
  app.register(require("fastify-cors"));

  // Add routes
  const prefix = opts.prefix || "";
  app.register(require("./routes"), { prefix: `${prefix}/api` });

  return { fastify: app };
};

module.exports = { getFastify };
