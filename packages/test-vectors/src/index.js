module.exports = {
  didCoreConformance: require('./did-core-conformance'),
  getKeyResolver: require('./getKeyResolver').getKeyResolver,

  // todo remove these items
  x25519KeyPair: require('./x25519-keypair.json').keypair,
  keyResolver: require('./keyResolver').keyResolver,
};
