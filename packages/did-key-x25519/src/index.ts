import { getGenerator, getResolver } from '@transmute/did-key-common';
import { X25519KeyPair } from '@transmute/x25519-key-pair';

export { X25519KeyPair };
export const generate = getGenerator(X25519KeyPair);
export const resolve = getResolver(X25519KeyPair);
