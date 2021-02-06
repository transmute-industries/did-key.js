import {
  privateKeyUInt8ArrayFromJwk,
  publicKeyUInt8ArrayFromJwk,
} from './keyUtils';
import base64url from 'base64url';
import secp256k1 from 'secp256k1';
import crypto from 'crypto';

export const sign = async (
  payload: any,
  privateKeyJwk: any,
  header: any = { alg: 'ES256K-R' }
): Promise<string> => {
  const privateKeyUInt8Array = await privateKeyUInt8ArrayFromJwk(privateKeyJwk);

  const encodedHeader = base64url.encode(JSON.stringify(header));
  const encodedPayload = base64url.encode(JSON.stringify(payload));
  const toBeSigned = `${encodedHeader}.${encodedPayload}`;
  const message = Buffer.from(toBeSigned);

  const digest = crypto
    .createHash('sha256')
    .update(message)
    .digest();

  const messageHashUInt8Array = digest;

  const sigObj: any = secp256k1.ecdsaSign(
    messageHashUInt8Array,
    privateKeyUInt8Array
  );

  const encodedSignature = base64url.encode(sigObj.signature);
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
};

export const verify = async (
  jws: string,
  publicKeyJwk: any
): Promise<boolean> => {
  const publicKeyUInt8Array = await publicKeyUInt8ArrayFromJwk(publicKeyJwk);
  const [encodedHeader, encodedPayload, encodedSignature] = jws.split('.');

  const header = JSON.parse(base64url.decode(encodedHeader));
  if (header.alg !== 'ES256K-R') {
    throw new Error('Expecteed header.alg to be  ES256K-R');
  }
  const toBeSigned = `${encodedHeader}.${encodedPayload}`;
  const message = Buffer.from(toBeSigned);
  const digest = crypto
    .createHash('sha256')
    .update(message)
    .digest();

  const messageHashUInt8Array = digest;
  const signatureUInt8Array = base64url.toBuffer(encodedSignature);
  let signatureLowerS = secp256k1.signatureNormalize(signatureUInt8Array);

  const verified = secp256k1.ecdsaVerify(
    signatureLowerS,
    messageHashUInt8Array,
    publicKeyUInt8Array
  );

  return verified;
};

export const signDetached = async (
  payload: Buffer,
  privateKeyJwk: any,
  header = {
    alg: 'ES256K-R',
    b64: false,
    crit: ['b64'],
  }
): Promise<string> => {
  const privateKeyUInt8Array = await privateKeyUInt8ArrayFromJwk(privateKeyJwk);
  const encodedHeader = base64url.encode(JSON.stringify(header));
  const toBeSignedBuffer = Buffer.concat([
    Buffer.from(encodedHeader + '.', 'utf8'),
    Buffer.from(payload.buffer, payload.byteOffset, payload.length),
  ]);

  const message = Buffer.from(toBeSignedBuffer);
  const digest = crypto
    .createHash('sha256')
    .update(message)
    .digest();

  const messageHashUInt8Array = digest;
  const { signature, recid }: any = secp256k1.ecdsaSign(
    messageHashUInt8Array,
    privateKeyUInt8Array
  );

  const signatureUInt8Array = Buffer.concat([
    Buffer.from(signature),
    Buffer.from(new Uint8Array([recid])),
  ]);

  const encodedSignature = base64url.encode(signatureUInt8Array);
  return `${encodedHeader}..${encodedSignature}`;
};

export const recoverPublicKey = async (
  jws: string,
  payload: any
): Promise<Uint8Array> => {
  if (jws.indexOf('..') === -1) {
    throw new Error('not a valid rfc7797 jws.');
  }
  const [encodedHeader, encodedSignature] = jws.split('..');
  const header = JSON.parse(base64url.decode(encodedHeader));
  if (header.alg !== 'ES256K-R') {
    throw new Error('JWS alg is not signed with ES256K-R.');
  }
  if (
    header.b64 !== false ||
    !header.crit ||
    !header.crit.length ||
    header.crit[0] !== 'b64'
  ) {
    throw new Error('JWS Header is not in rfc7797 format (not detached).');
  }

  const toBeSignedBuffer = Buffer.concat([
    Buffer.from(encodedHeader + '.', 'utf8'),
    Buffer.from(payload.buffer, payload.byteOffset, payload.length),
  ]);
  const message = Buffer.from(toBeSignedBuffer);

  const digest = new Uint8Array(
    crypto
      .createHash('sha256')
      .update(message)
      .digest()
  );

  let signatureUInt8Array = new Uint8Array(
    base64url.toBuffer(encodedSignature)
  );

  const recoveryId = signatureUInt8Array[64];
  signatureUInt8Array = signatureUInt8Array.slice(0, 64);

  return secp256k1.ecdsaRecover(signatureUInt8Array, recoveryId, digest);
};
