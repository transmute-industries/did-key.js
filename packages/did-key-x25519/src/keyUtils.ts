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

export const privateKeyJwkFromPrivateKeyBase58 = (
  publicKeyBase58: string,
  privateKeybase58: string
) => {
  const publicKeyBytes = bs58.decode(publicKeyBase58);
  const privateKeyBytes = bs58.decode(privateKeybase58);
  const _jwk = {
    kty: 'OKP',
    crv: 'X25519',
    d: base64url.encode(privateKeyBytes),
    x: base64url.encode(publicKeyBytes),
  };
  const kid = getKid(_jwk);
  return {
    ..._jwk,
    kid,
  };
};

export const publicKeyJwkFromPublicKeyBase58 = (publicKeyBase58: string) => {
  const _jwk = {
    kty: 'OKP',
    crv: 'X25519',
    x: base64url.encode(bs58.decode(publicKeyBase58)),
  };
  const kid = getKid(_jwk);
  return {
    ..._jwk,
    kid,
  };
};

export const privateKeyHexFromPrivateKeyBase58 = (privateKeyBase58: string) => {
  return Buffer.from(bs58.decode(privateKeyBase58)).toString('hex');
};

export const publicKeyHexFromPublicKeyBase58 = (publicKeyBase58: string) => {
  return Buffer.from(bs58.decode(publicKeyBase58)).toString('hex');
};

export const privateKeyBase58FromPrivateKeyJwk = (jwk: any) => {
  return bs58.encode(base64url.toBuffer(jwk.d));
};

export const publicKeyBase58FromPublicKeyJwk = (jwk: any) => {
  return bs58.encode(base64url.toBuffer(jwk.x));
};

export const privateKeyBase58FromPrivateKeyHex = (privateKeyHex: string) => {
  return bs58.encode(Buffer.from(privateKeyHex, 'hex'));
};

export const publicKeyBase58FromPublicKeyHex = (publicKeyHex: string) => {
  return bs58.encode(Buffer.from(publicKeyHex, 'hex'));
};
