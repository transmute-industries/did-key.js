import { getGenerator, getResolver } from '@transmute/did-key-common';
import { Secp256k1KeyPair } from '@transmute/secp256k1-key-pair';

export { Secp256k1KeyPair };
export const generate = getGenerator(Secp256k1KeyPair);
export const resolve = getResolver(Secp256k1KeyPair);
