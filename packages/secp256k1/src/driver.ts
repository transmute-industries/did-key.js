import { Secp256k1KeyPair } from './Secp256k1KeyPair';
import { getResolve, getGet } from '@transmute/did-key-common';

export const resolve = getResolve(Secp256k1KeyPair);
export const get = getGet(resolve);
