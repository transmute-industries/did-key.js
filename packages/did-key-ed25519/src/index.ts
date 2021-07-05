import { getGenerator, getResolver } from '@transmute/did-key-common';
import { Ed25519KeyPair } from '@transmute/ed25519-key-pair';

export { Ed25519KeyPair };
export const generate = getGenerator(Ed25519KeyPair);
export const resolve = getResolver(Ed25519KeyPair);
