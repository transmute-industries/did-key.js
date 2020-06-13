// https://github.com/transmute-industries/json-ld-sig-detached-jws/blob/master/src/utils.js
import bs58 from 'bs58';
import base64url from 'base64url';
import crypto from 'crypto';
import canonicalize from 'canonicalize';

export const getKid = (jwk: any) => {
  const copy = { ...jwk } as any;
  delete copy.d;
  delete copy.kid;
  delete copy.alg;
  const digest = crypto
    .createHash('sha256')
    .update(canonicalize(copy))
    .digest();
  return base64url.encode(Buffer.from(digest));
};

export const publicKeyBase58FromPublicKeyHex = (publicKeyHex: string) => {
  return bs58.encode(Buffer.from(publicKeyHex, 'hex'));
};

export const privateKeyBase58FromPrivateKeyHex = (privateKeyHex: string) => {
  return bs58.encode(Buffer.from(privateKeyHex, 'hex'));
};

export const publicKeyJwkFromPublicKeyBase58 = (publicKeyBase58: string) => {
  const jwk = {
    crv: 'Ed25519',
    x: base64url.encode(bs58.decode(publicKeyBase58)),
    kty: 'OKP',
  };
  const kid = getKid(jwk);
  return {
    ...jwk,
    kid,
  };
};

export const privateKeyJwkFromPrivateKeyBase58 = (privateKeyBase58: string) => {
  const privateKeyBuf = bs58.decode(privateKeyBase58);
  const jwk = {
    crv: 'Ed25519',
    d: base64url.encode(privateKeyBuf.slice(0, 32)),
    x: base64url.encode(privateKeyBuf.slice(32, 64)),
    kty: 'OKP',
  };
  const kid = getKid(jwk);
  return {
    ...jwk,
    kid,
  };
};

export const publicKeyBase58FromPublicKeyJwk = (publicKeyJwk: any) => {
  return bs58.encode(base64url.toBuffer(publicKeyJwk.x));
};

export const privateKeyBase58FromPrivateKeyJwk = (privateKeyJwk: any) => {
  return bs58.encode(
    Buffer.concat([
      base64url.toBuffer(privateKeyJwk.d),
      base64url.toBuffer(privateKeyJwk.x),
    ])
  );
};

export const publicKeyHexFromPublicKeyBase58 = (publicKeyBase58: string) => {
  return bs58.decode(publicKeyBase58).toString('hex');
};

export const privateKeyHexFromPrivateKeyBase58 = (privateKeyBase58: string) => {
  return bs58.decode(privateKeyBase58).toString('hex');
};
