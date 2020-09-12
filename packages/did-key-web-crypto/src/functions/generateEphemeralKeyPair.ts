// see also https://github.com/digitalbazaar/minimal-cipher/blob/44842ce49a5e850b57bb913b9a441ae2f5b0b578/algorithms/x25519-helper.js

import { generate } from './generate';
export async function generateEphemeralKeyPair() {
  let keyPair = await generate();
  return {
    keyPair,
    epk: keyPair.publicKeyJwk,
  };
}
