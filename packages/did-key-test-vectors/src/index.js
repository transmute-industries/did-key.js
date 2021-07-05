const ed25519 = {
  0: require('./ed25519/did-key-ed25519-case-0.json'),
  1: require('./ed25519/did-key-ed25519-case-1.json'),
  2: require('./ed25519/did-key-ed25519-case-2.json'),
};

const x25519 = {
  0: require('./x25519/did-key-x25519-case-0.json'),
  1: require('./x25519/did-key-x25519-case-1.json'),
  2: require('./x25519/did-key-x25519-case-2.json'),
};

const secp256k1 = {
  0: require('./secp256k1/did-key-secp256k1-case-0.json'),
  1: require('./secp256k1/did-key-secp256k1-case-1.json'),
  2: require('./secp256k1/did-key-secp256k1-case-2.json'),
};

const bls12381 = {
  0: require('./bls12381/did-key-bls12381-case-0.json'),
  1: require('./bls12381/did-key-bls12381-case-1.json'),
  2: require('./bls12381/did-key-bls12381-case-2.json'),
};

const secp256r1 = {
  0: require('./secp256r1/did-key-secp256r1-case-0.json'),
  1: require('./secp256r1/did-key-secp256r1-case-1.json'),
  2: require('./secp256r1/did-key-secp256r1-case-2.json'),
};

const secp384r1 = {
  0: require('./secp384r1/did-key-secp384r1-case-0.json'),
  1: require('./secp384r1/did-key-secp384r1-case-1.json'),
  2: require('./secp384r1/did-key-secp384r1-case-2.json'),
};

const secp521r1 = {
  0: require('./secp521r1/did-key-secp521r1-case-0.json'),
  1: require('./secp521r1/did-key-secp521r1-case-1.json'),
  2: require('./secp521r1/did-key-secp521r1-case-2.json'),
};

module.exports = {
  ed25519,
  x25519,
  secp256k1,
  bls12381,
  secp256r1,
  secp384r1,
  secp521r1,
};
