// from https://github.com/digitalbazaar/minimal-cipher/blob/7a63e2b57678a425369181a6468b0a5d2ba9762e/algorithms/ecdhkdf.js
/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */

import { Crypto } from 'node-webcrypto-ossl';

const crypto = new Crypto();

import { TextEncoder } from 'util';

// only supported algorithm
const KEY_ALGORITHM = 'ECDH-ES+A256KW';

// create static ALGORITHM_ID
const ALGORITHM_CONTENT = new TextEncoder().encode(KEY_ALGORITHM);
const ALGORITHM_ID = new Uint8Array(4 + ALGORITHM_CONTENT.length);
// write length of content as 32-bite big endian integer, then write content
const dv = new DataView(
  ALGORITHM_ID.buffer,
  ALGORITHM_ID.byteOffset,
  ALGORITHM_ID.byteLength
);
dv.setUint32(0, ALGORITHM_CONTENT.length);
ALGORITHM_ID.set(ALGORITHM_CONTENT, 4);

// RFC 7518 Section 4.6.2 specifies using SHA-256 for ECDH-ES KDF
// https://tools.ietf.org/html/rfc7518#section-4.6.2
const HASH_ALGORITHM = { name: 'SHA-256' };

// derived keys are always 256-bits
const KEY_LENGTH = 256;

/**
 * Derives a 256-bit AES-KW key encryption key from a shared secret that
 * was derived from an ephemeral and static pair of Elliptic Curve
 * Diffie-Hellman keys.
 *
 * The KDF used is described in RFC 7518. This KDF is referenced by RFC 8037,
 * which defines how to perform Curve25519 (X25519) ECDH key agreement.
 *
 * @param {Uint8Array} secret the shared secret (i.e., `Z`) to use.
 * @param {Uint8Array} consumerInfo an array of application-specific bytes
 *   describing the consumer (aka the "encrypter" or "sender").
 * @param {Uint8Array} producerInfo an array of application-specific bytes
 *   describing the producer (aka the "decrypter" or "receiver"/"recipient").
 *
 * @return {Promise<Uint8Array>} resolves to the generated key.
 */
export async function deriveKey({ secret, producerInfo, consumerInfo }: any) {
  if (!(secret instanceof Uint8Array && secret.length > 0)) {
    throw new TypeError('"secret" must be a non-empty Uint8Array.');
  }
  if (!(producerInfo instanceof Uint8Array && producerInfo.length > 0)) {
    throw new TypeError('"producerInfo" must be a non-empty Uint8Array.');
  }
  if (!(consumerInfo instanceof Uint8Array && consumerInfo.length > 0)) {
    throw new TypeError('"consumerInfo" must be a non-empty Uint8Array.');
  }

  // the output of Concat KDF is hash(roundNumber || Z || OtherInfo)
  // where roundNumber is always 1 because the hash length is presumed to
  // ...match the key length, encoded as a big endian 32-bit integer
  // where OtherInfo is:
  // AlgorithmID || PartyUInfo || PartyVInfo || SuppPubInfo
  // where SuppPubInfo is the key length in bits, big endian encoded as a
  // 32-bit number, i.e., 256 === [0, 0, 1, 0]
  const input = new Uint8Array(
    4 + // round number
    secret.length + // `Z`
    ALGORITHM_ID.length + // AlgorithmID
    4 +
    producerInfo.length + // PartyUInfo
    4 +
    consumerInfo.length + // PartyVInfo
      4
  ); // SuppPubInfo (key data length in bits)
  let offset = 0;
  const dv = new DataView(input.buffer, input.byteOffset, input.byteLength);
  dv.setUint32(offset, 1);
  input.set(secret, (offset += 4));
  input.set(ALGORITHM_ID, (offset += secret.length));
  dv.setUint32((offset += ALGORITHM_ID.length), producerInfo.length);
  input.set(producerInfo, (offset += 4));
  dv.setUint32((offset += producerInfo.length), consumerInfo.length);
  input.set(consumerInfo, (offset += 4));
  dv.setUint32((offset += consumerInfo.length), KEY_LENGTH);

  // hash input and return result as derived key
  return new Uint8Array(await crypto.subtle.digest(HASH_ALGORITHM, input));
}
