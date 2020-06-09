import base64url from 'base64url';

import { binToHex, hexToBin, instantiateSecp256k1 } from 'bitcoin-ts';

import crypto from 'crypto';

import {
  ISecp256k1PrivateKeyJwk,
  ISecp256k1PublicKeyJwk,
  privateKeyUInt8ArrayFromJwk,
  publicKeyUInt8ArrayFromJwk,
} from './keyUtils';

/** error matching @panva/jose for JWS verification failure. */
class JWSVerificationFailed extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JWSVerificationFailed';
  }
}

/** JWS Header */
export interface IJWSHeader {
  /** algorithm, ES256K */
  alg: string;

  /** type, JWT */
  typ?: string;
  /** signing key id, ... */
  kid?: string;
}

/** Produce a JWS Unencoded Payload per https://tools.ietf.org/html/rfc7797#section-6 */
export const signDetached = async (
  // in the case of EcdsaSecp256k1Signature2019 this is the result of createVerifyData
  payload: Buffer,
  privateKeyJwk: ISecp256k1PrivateKeyJwk,
  header = {
    alg: 'ES256K',
    b64: false,
    crit: ['b64'],
  }
) => {
  const privateKeyUInt8Array = await privateKeyUInt8ArrayFromJwk(privateKeyJwk);
  const secp256k1 = await instantiateSecp256k1();
  const encodedHeader = base64url.encode(JSON.stringify(header));

  const toBeSignedBuffer = Buffer.concat([
    Buffer.from(encodedHeader + '.', 'utf8'),
    Buffer.from(payload.buffer, payload.byteOffset, payload.length),
  ]);

  const message = Buffer.from(toBeSignedBuffer);

  const digest = crypto
    .createHash('sha256')
    .update(message)
    .digest()
    .toString('hex');

  const messageHashUInt8Array = hexToBin(digest);

  const signatureUInt8Array = secp256k1.signMessageHashCompact(
    privateKeyUInt8Array,
    messageHashUInt8Array
  );

  const signatureHex = binToHex(signatureUInt8Array);
  const encodedSignature = base64url.encode(Buffer.from(signatureHex, 'hex'));

  return `${encodedHeader}..${encodedSignature}`;
};

/** Verify a JWS Unencoded Payload per https://tools.ietf.org/html/rfc7797#section-6 */
export const verifyDetached = async (
  jws: string,
  payload: Buffer,
  publicKeyJwk: ISecp256k1PublicKeyJwk
) => {
  if (jws.indexOf('..') === -1) {
    throw new JWSVerificationFailed('not a valid rfc7797 jws.');
  }
  const [encodedHeader, encodedSignature] = jws.split('..');
  const header = JSON.parse(base64url.decode(encodedHeader));
  if (header.alg !== 'ES256K') {
    throw new Error('JWS alg is not signed with ES256K.');
  }
  if (
    header.b64 !== false ||
    !header.crit ||
    !header.crit.length ||
    header.crit[0] !== 'b64'
  ) {
    throw new Error('JWS Header is not in rfc7797 format (not detached).');
  }
  const publicKeyUInt8Array = await publicKeyUInt8ArrayFromJwk(publicKeyJwk);
  const secp256k1 = await instantiateSecp256k1();
  const toBeSignedBuffer = Buffer.concat([
    Buffer.from(encodedHeader + '.', 'utf8'),
    Buffer.from(payload.buffer, payload.byteOffset, payload.length),
  ]);
  const message = Buffer.from(toBeSignedBuffer);
  const digest = crypto
    .createHash('sha256')
    .update(message)
    .digest()
    .toString('hex');
  const messageHashUInt8Array = hexToBin(digest);
  const signatureUInt8Array = hexToBin(
    base64url.toBuffer(encodedSignature).toString('hex')
  );
  const verified = secp256k1.verifySignatureCompact(
    signatureUInt8Array,
    publicKeyUInt8Array,
    messageHashUInt8Array
  );
  if (verified) {
    return true;
  }
  throw new Error('Cannot verify detached signature.');
};

/** Produce a normal ES256K JWS */
export const sign = async (
  payload: any,
  privateKeyJwk: ISecp256k1PrivateKeyJwk,
  header: IJWSHeader = { alg: 'ES256K' }
) => {
  const privateKeyUInt8Array = await privateKeyUInt8ArrayFromJwk(privateKeyJwk);
  const secp256k1 = await instantiateSecp256k1();

  const encodedHeader = base64url.encode(JSON.stringify(header));
  const encodedPayload = base64url.encode(JSON.stringify(payload));
  const toBeSigned = `${encodedHeader}.${encodedPayload}`;
  const message = Buffer.from(toBeSigned);

  const digest = crypto
    .createHash('sha256')
    .update(message)
    .digest()
    .toString('hex');
  const messageHashUInt8Array = hexToBin(digest);
  const signatureUInt8Array = secp256k1.signMessageHashCompact(
    privateKeyUInt8Array,
    messageHashUInt8Array
  );
  const signatureHex = binToHex(signatureUInt8Array);
  const encodedSignature = base64url.encode(Buffer.from(signatureHex, 'hex'));
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
};

/** Verify an ES256K JWS, returns the decoded object if successful, throws otherwise. */
export const verify = async (
  jws: string,
  publicKeyJwk: ISecp256k1PublicKeyJwk
) => {
  const secp256k1 = await instantiateSecp256k1();
  const publicKeyUInt8Array = await publicKeyUInt8ArrayFromJwk(publicKeyJwk);
  const [encodedHeader, encodedPayload, encodedSignature] = jws.split('.');
  const toBeSigned = `${encodedHeader}.${encodedPayload}`;

  const message = Buffer.from(toBeSigned);
  const digest = crypto
    .createHash('sha256')
    .update(message)
    .digest()
    .toString('hex');

  const messageHashUInt8Array = hexToBin(digest);

  const signatureUInt8Array = hexToBin(
    base64url.toBuffer(encodedSignature).toString('hex')
  );

  const verified = secp256k1.verifySignatureCompact(
    signatureUInt8Array,
    publicKeyUInt8Array,
    messageHashUInt8Array
  );
  if (verified) {
    return JSON.parse(base64url.decode(encodedPayload));
  }
  throw new JWSVerificationFailed('signature verification failed');
};

/** decode a JWS (without verifying it) */
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

export default {
  decode,

  sign,
  signDetached,

  verify,
  verifyDetached,
};
