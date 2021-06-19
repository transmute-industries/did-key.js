import base64url from 'base64url';

import * as ed25519 from '@stablelib/ed25519';

import canonicalize from 'canonicalize';

class JWSVerificationFailed extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JWSVerificationFailed';
  }
}

const _jwkToSecretKey = (jwk: any) => {
  const d = base64url.toBuffer(jwk.d);
  const x = base64url.toBuffer(jwk.x);
  const secretKey = new Uint8Array(Buffer.concat([d, x]));
  return secretKey;
};

const _jwkToPublicKey = (jwk: any) => {
  const x = base64url.toBuffer(jwk.x);
  const publicKey = new Uint8Array(x);
  return publicKey;
};

export const decode = (jws: string, options = { complete: false }) => {
  const [encodedHeader, encodedPayload, encodedSignature] = jws.split('.');

  if (options.complete) {
    return {
      header: JSON.parse(base64url.decode(encodedHeader)),
      payload: JSON.parse(base64url.decode(encodedPayload)),
      signature: encodedSignature,
    };
  }
  return JSON.parse(base64url.decode(encodedPayload));
};

export const sign = (
  payload: any,
  privateKeyJwk: any,
  header: any = {
    alg: 'EdDSA',
  }
) => {
  const secretKey = _jwkToSecretKey(privateKeyJwk);
  const encodedHeader = base64url.encode(canonicalize(header));
  const encodedPayload = base64url.encode(canonicalize(payload));
  const message = new Uint8Array(
    Buffer.from(`${encodedHeader}.${encodedPayload}`)
  );
  const signature = ed25519.sign(secretKey, message);
  const encodedSignature = base64url.encode(Buffer.from(signature));
  const jws = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  return jws;
};

export const signDetached = (
  payload: Buffer,
  privateKeyJwk: any,
  header: any = {
    alg: 'EdDSA',
  }
) => {
  const secretKey = _jwkToSecretKey(privateKeyJwk);
  const encodedHeader = base64url.encode(canonicalize(header));
  const message = new Uint8Array(
    Buffer.concat([
      Buffer.from(encodedHeader, 'utf-8'),
      Buffer.from('.', 'utf-8'),
      payload,
    ])
  );
  const signature = ed25519.sign(secretKey, message);
  const encodedSignature = base64url.encode(Buffer.from(signature));
  const jws = `${encodedHeader}..${encodedSignature}`;
  return jws;
};

export const verify = (jws: string, publicKeyJwk: any) => {
  const publicKey = _jwkToPublicKey(publicKeyJwk);
  const [encodedHeader, encodedPayload, encodedSignature] = jws.split('.');

  const message = new Uint8Array(
    Buffer.from(`${encodedHeader}.${encodedPayload}`)
  );
  const verified = ed25519.verify(
    publicKey,
    message,
    new Uint8Array(base64url.toBuffer(encodedSignature))
  );

  if (verified) {
    return JSON.parse(base64url.decode(encodedPayload));
  }

  throw new JWSVerificationFailed('signature verification failed');
};

export const verifyDetached = (
  jws: string,
  payload: Buffer,
  publicKeyJwk: any
) => {
  const publicKey = _jwkToPublicKey(publicKeyJwk);
  const [encodedHeader, encodedSignature] = jws.split('..');
  const message = new Uint8Array(
    Buffer.concat([
      Buffer.from(encodedHeader, 'utf-8'),
      Buffer.from('.', 'utf-8'),
      payload,
    ])
  );
  const verified = ed25519.verify(
    publicKey,
    message,
    new Uint8Array(base64url.toBuffer(encodedSignature))
  );
  return verified;
};

export default {
  decode,

  sign,
  signDetached,

  verify,
  verifyDetached,
};
