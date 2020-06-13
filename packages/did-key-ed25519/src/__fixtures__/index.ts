export const seed =
  '9b937b81322d816cfab9d5a3baacc9b2a5febe4b149f126b3630f93a29527017';

export const ed25519 = {
  publicKeyHex:
    '095f9a1a595dde755d82786864ad03dfa5a4fbd68832566364e2b65e13cc9e44',
  privateKeyHex:
    '9b937b81322d816cfab9d5a3baacc9b2a5febe4b149f126b3630f93a29527017095f9a1a595dde755d82786864ad03dfa5a4fbd68832566364e2b65e13cc9e44',
};

export const x25519 = {
  publicKeyHex:
    '1150c79f402e26a82afee189c4648778ff91605aee8a96d4ca922c30e6482b09',
  privateKeyHex:
    '784f007ed065f6f0ceae66a19e9cb6590ea0c97ecec758d858e3f75d9f336f62',
};

export const message = 'hello world';
export const signature =
  '0276c3f88f4e5d21e185caa31ca77dbac9495e618fbba17f35ac118a060bdfe25cf1ea4980a0bc6f2b2570f59411b9761b2122c905c3af7655f813cbd84f2303';

export const ed25519_base58btc = {
  type: 'Ed25519VerificationKey2018',
  id: '#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
  controller: 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
  publicKeyBase58: 'dbDmZLTWuEYYZNHFLKLoRkEX4sZykkSLNQLXvMUyMB1',
  privateKeyBase58:
    '47QbyJEDqmHTzsdg8xzqXD8gqKuLufYRrKWTmB7eAaWHG2EAsQ2GUyqRqWWYT15dGuag52Sf3j4hs2mu7w52mgps',
};

export const ed25519_jwk = {
  type: 'Ed25519VerificationKey2018',
  id: '#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
  controller: 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
  publicKeyJwk: {
    crv: 'Ed25519',
    kid: 'ovsDKYBjFemIy8DVhc-w2LSi8CvXMw2AYDzHj04yxkc',
    kty: 'OKP',
    x: 'CV-aGlld3nVdgnhoZK0D36Wk-9aIMlZjZOK2XhPMnkQ',
  },
  privateKeyJwk: {
    crv: 'Ed25519',
    d: 'm5N7gTItgWz6udWjuqzJsqX-vksUnxJrNjD5OilScBc',
    kid: 'ovsDKYBjFemIy8DVhc-w2LSi8CvXMw2AYDzHj04yxkc',
    kty: 'OKP',
    x: 'CV-aGlld3nVdgnhoZK0D36Wk-9aIMlZjZOK2XhPMnkQ',
  },
};

export const ed25519_hex = {
  type: 'Ed25519VerificationKey2018',
  id: '#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
  controller: 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
  publicKeyHex: ed25519.publicKeyHex,
  privateKeyHex: ed25519.privateKeyHex,
};

export const didDocument = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    {
      '@base': 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
    },
  ],
  id: 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
  publicKey: [
    {
      id: '#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
      type: 'Ed25519VerificationKey2018',
      controller: 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
      publicKeyBase58: 'dbDmZLTWuEYYZNHFLKLoRkEX4sZykkSLNQLXvMUyMB1',
    },
  ],
  authentication: ['#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP'],
  assertionMethod: ['#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP'],
  capabilityDelegation: ['#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP'],
  capabilityInvocation: ['#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP'],
};
