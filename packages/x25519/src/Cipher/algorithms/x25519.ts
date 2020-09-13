/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
import base64url from 'base64url-universal';
import { createKek } from './aeskw';
import * as base58 from 'base58-universal';
import { deriveKey } from './ecdhkdf';
import { TextEncoder } from '../util';
import { deriveSecret, deriveEphemeralKeyPair } from './x25519-helper';

const KEY_TYPE = 'X25519KeyAgreementKey2019';

export const JWE_ALG = 'ECDH-ES+A256KW';
export { deriveEphemeralKeyPair, deriveSecret };

// Decryption case: get KeyEncryptionKey from a private key agreement key and a
// peer's public ephemeral DH key encoded as an `epk`
export async function kekFromEphemeralPeer({ keyAgreementKey, epk }: any) {
  if (!(epk && typeof epk === 'object')) {
    throw new TypeError('"epk" must be an object.');
  }
  if (epk.kty !== 'OKP') {
    throw new Error('"epk.kty" must be the string "OKP".');
  }
  if (epk.crv !== 'X25519') {
    throw new Error('"epk.crv" must be the string "X25519".');
  }
  // decode public key material
  const publicKey = base64url.decode(epk.x);

  // convert to LD key for Web KMS
  const ephemeralPublicKey = {
    type: KEY_TYPE,
    publicKeyBase58: base58.encode(publicKey),
  };

  // safe to use IDs like in rfc7518 or does
  // https://tools.ietf.org/html/rfc7748#section-7 pose any issues?
  const encoder = new TextEncoder();
  // "Party U Info"
  const producerInfo = publicKey;
  // "Party V Info"
  const consumerInfo = encoder.encode(keyAgreementKey.id);
  const secret = await keyAgreementKey.deriveSecret({
    publicKey: ephemeralPublicKey,
  });
  const keyData = await deriveKey({ secret, producerInfo, consumerInfo });
  return {
    kek: await createKek({ keyData }),
  };
}

// Encryption case: get KeyEncryptionKey *and* ephemeral DH key from a peer's public
// static key
export async function kekFromStaticPeer({
  ephemeralKeyPair,
  staticPublicKey,
}: any) {
  const { privateKey } = ephemeralKeyPair;
  // TODO: consider accepting JWK format for `staticPublicKey` not just LD key
  if (staticPublicKey.type !== KEY_TYPE) {
    throw new Error(`"staticPublicKey.type" must be "${KEY_TYPE}".`);
  }
  const remotePublicKey = base58.decode(staticPublicKey.publicKeyBase58);

  const encoder = new TextEncoder();
  // "Party U Info"
  const producerInfo = ephemeralKeyPair.publicKey;
  // "Party V Info"
  const consumerInfo = encoder.encode(staticPublicKey.id);
  const secret = await deriveSecret({ privateKey, remotePublicKey });
  const keyData = await deriveKey({ secret, producerInfo, consumerInfo });
  return {
    kek: await createKek({ keyData }),
    epk: ephemeralKeyPair.epk,
    apu: base64url.encode(producerInfo),
    apv: base64url.encode(consumerInfo as any),
    ephemeralPublicKey: ephemeralKeyPair.publicKey,
  };
}
