import * as help from './crypto-helper';
import base64url from 'base64url';

const sign = async (
  privateKeyJwk: any,
  payload: any,
  header: any = { alg: 'ES384' }
) => {
  const toBeSigned = `${base64url.encode(
    JSON.stringify(header)
  )}.${base64url.encode(JSON.stringify(payload))}`;
  const signature = await help.sign(
    new Uint8Array(Buffer.from(toBeSigned)),
    privateKeyJwk
  );
  return `${toBeSigned}.${base64url.encode(Buffer.from(signature))}`;
};

const verify = async (publicKeyJwk: any, jws: string) => {
  const [encodedHeader, encodedPayload, encodedSignature] = jws.split('.');
  const toBeSigned = [encodedHeader, encodedPayload].join('.');

  let verified = false;

  verified = await help.verify(
    new Uint8Array(Buffer.from(toBeSigned)),
    new Uint8Array(base64url.toBuffer(encodedSignature)),
    publicKeyJwk
  );

  return verified;
};

const signDetached = async (
  privateKeyJwk: any,
  payload: Buffer,
  header: any = { alg: 'ES384' }
) => {
  const encodedHeader = base64url.encode(JSON.stringify(header));
  const toBeSignedBuffer = Buffer.concat([
    Buffer.from(encodedHeader + '.', 'utf8'),
    Buffer.from(payload.buffer, payload.byteOffset, payload.length),
  ]);
  const signature = await help.sign(
    new Uint8Array(toBeSignedBuffer),
    privateKeyJwk
  );
  return `${encodedHeader}..${base64url.encode(Buffer.from(signature))}`;
};

const verifyDetached = async (
  publicKeyJwk: any,
  jws: string,
  payload: Buffer
) => {
  const [encodedHeader, encodedSignature] = jws.split('..');
  const toBeSignedBuffer = Buffer.concat([
    Buffer.from(encodedHeader + '.', 'utf8'),
    Buffer.from(payload.buffer, payload.byteOffset, payload.length),
  ]);

  let verified = false;

  verified = await help.verify(
    new Uint8Array(Buffer.from(toBeSignedBuffer)),
    new Uint8Array(base64url.toBuffer(encodedSignature)),
    publicKeyJwk
  );

  return verified;
};

export { sign, verify, signDetached, verifyDetached };
