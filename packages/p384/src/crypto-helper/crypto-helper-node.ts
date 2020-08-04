import { Crypto } from 'node-webcrypto-ossl';

function isNodejs() {
  return (
    typeof process === 'object' &&
    typeof process.versions === 'object' &&
    typeof process.versions.node !== 'undefined'
  );
}

let crypto: Crypto;

if (isNodejs()) {
  crypto = new Crypto();
} else {
  crypto = window.crypto as Crypto;
}

const generate = async () => {
  let key = await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-384',
    },
    true,
    ['sign', 'verify']
  );
  const publicKeyJwk = await crypto.subtle.exportKey('jwk', key.publicKey);
  const privateKeyJwk = await crypto.subtle.exportKey('jwk', key.privateKey);
  return {
    publicKeyJwk,
    privateKeyJwk,
  };
};

const sign = async (message: Uint8Array, privateKeyJwk: any) => {
  const privateKey = await crypto.subtle.importKey(
    'jwk',
    privateKeyJwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-384',
    },
    true,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-384' },
    },
    privateKey,
    message
  );
  return new Uint8Array(signature);
};

const verify = async (
  message: Uint8Array,
  signature: Uint8Array,
  publicKeyJwk: any
) => {
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    publicKeyJwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-384',
    },
    true,
    ['verify']
  );

  return crypto.subtle.verify(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-384' },
    },
    publicKey,
    signature,
    message
  );
};

const deriveSecret = async (
  privateKeyJwk: any,
  publicKeyJwk: any
): Promise<Uint8Array> => {
  const privateKey = await crypto.subtle.importKey(
    'jwk',
    privateKeyJwk,
    {
      name: 'ECDH',
      namedCurve: 'P-384',
    },
    true,
    ['deriveBits']
  );
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    publicKeyJwk,
    {
      name: 'ECDH',
      namedCurve: 'P-384',
    },
    true,
    ['deriveBits']
  );
  const result = await crypto.subtle.deriveBits(
    {
      name: 'ECDH',
      public: publicKey,
    },
    privateKey,
    256
  );
  return new Uint8Array(result);
};

export { generate, sign, verify, deriveSecret };
