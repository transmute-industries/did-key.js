import crypto from 'crypto';
import canonicalize from 'canonicalize';
import base64url from 'base64url';
import * as bs58 from 'bs58';
import { IP384PublicKeyJwk, IP384PrivateKeyJwk } from './types';

export const getKid = (jwk: IP384PublicKeyJwk | IP384PrivateKeyJwk) => {
  const digest = crypto
    .createHash('sha256')
    .update(
      canonicalize({
        crv: jwk.crv,
        x: jwk.x,
        y: jwk.y,
        kty: jwk.kty,
      })
    )
    .digest();
  return base64url.encode(Buffer.from(digest));
};

export const publicKeyJwkToPublicKeyBase58 = (
  publicKeyJwk: IP384PublicKeyJwk
) => {
  const publicKeyBuffer = Buffer.concat([
    base64url.toBuffer(publicKeyJwk.x),
    base64url.toBuffer(publicKeyJwk.y),
  ]);
  return bs58.encode(publicKeyBuffer);
};

export const publicKeyBase58toPublicKeyJwk = (publicKeyBase58: string) => {
  const buffer = bs58.decode(publicKeyBase58);
  const jwk: IP384PublicKeyJwk = {
    crv: 'P-384',
    x: base64url.encode(buffer.slice(0, 48)),
    y: base64url.encode(buffer.slice(48, 96)),
    kty: 'EC',
  };

  return { ...jwk, kid: getKid(jwk) };
};

export const privateKeyJwkToPrivateKeyBase58 = (
  privateKeyJwk: IP384PrivateKeyJwk
) => {
  return bs58.encode(base64url.toBuffer(privateKeyJwk.d));
};

export const privateKeyBase58toPrivateKeyJwk = (
  privateKeyBase58: string,
  publicKeyBase58: string
) => {
  const publicKeyJwk = publicKeyBase58toPublicKeyJwk(publicKeyBase58);
  return {
    ...publicKeyJwk,
    d: base64url.encode(bs58.decode(privateKeyBase58)),
  };
};
