import { Crypto } from 'node-webcrypto-ossl';

const crypto = new Crypto();

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

export { generate, sign, verify };
