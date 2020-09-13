/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
import base64url from 'base64url-universal';
import nacl from 'tweetnacl';
import * as node12Crypto from 'crypto';
import * as util from 'util';
const { promisify } = util;

const crypto: any = node12Crypto;

const generateKeyPairAsync = promisify(crypto.generateKeyPair);

const PUBLIC_KEY_DER_PREFIX = new Uint8Array([
  48,
  42,
  48,
  5,
  6,
  3,
  43,
  101,
  110,
  3,
  33,
  0,
]);

const PRIVATE_KEY_DER_PREFIX = new Uint8Array([
  48,
  46,
  2,
  1,
  0,
  48,
  5,
  6,
  3,
  43,
  101,
  110,
  4,
  34,
  4,
  32,
]);

export async function deriveEphemeralKeyPair() {
  // generate X25519 ephemeral public key
  let keyPair;
  if (await _hasNodeDiffieHellman()) {
    const publicKeyEncoding = { format: 'der', type: 'spki' };
    const privateKeyEncoding = { format: 'der', type: 'pkcs8' };
    const {
      publicKey: publicDerBytes,
      privateKey: privateDerBytes,
    } = await generateKeyPairAsync('x25519', {
      publicKeyEncoding,
      privateKeyEncoding,
    });
    const publicKey = publicDerBytes.slice(12, 12 + 32);
    const secretKey = privateDerBytes.slice(16, 16 + 32);
    keyPair = { secretKey, publicKey };
  } else {
    keyPair = nacl.box.keyPair();
  }
  const { secretKey: privateKey, publicKey } = keyPair;
  return {
    privateKey,
    publicKey,
    epk: {
      kty: 'OKP',
      crv: 'X25519',
      x: base64url.encode(publicKey),
    },
  };
}

export async function deriveSecret({ privateKey, remotePublicKey }: any) {
  if (await _hasNodeDiffieHellman()) {
    const nodePrivateKey = crypto.createPrivateKey({
      key: Buffer.concat([PRIVATE_KEY_DER_PREFIX, privateKey]),
      format: 'der',
      type: 'pkcs8',
    });
    const nodePublicKey = crypto.createPublicKey({
      key: Buffer.concat([PUBLIC_KEY_DER_PREFIX, remotePublicKey]),
      format: 'der',
      type: 'spki',
    });
    return crypto.diffieHellman({
      privateKey: nodePrivateKey,
      publicKey: nodePublicKey,
    });
  }

  // `scalarMult` takes secret key as param 1, public key as param 2
  return nacl.scalarMult(privateKey, remotePublicKey);
}

async function _hasNodeDiffieHellman() {
  // crypto.diffieHellman was added in Node.js v13.9.0
  return !!crypto.diffieHellman;
}
