module.exports = function(fastify, opts, done) {
    fastify.register(require("./dids"), { prefix: "/dids" });
  
    done();
  };
  