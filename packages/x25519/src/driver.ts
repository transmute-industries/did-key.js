import { X25519KeyPair } from './X25519KeyPair';
import { getResolve, getGet } from '@transmute/did-key-common';

export const resolve = getResolve(X25519KeyPair);
export const get = getGet(resolve);
