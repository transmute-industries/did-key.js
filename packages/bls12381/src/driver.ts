import { getResolve, getGet } from '@transmute/did-key-common';

import { Bls12381G2KeyPair } from './Bls12381G2KeyPair';

export const resolve = getResolve(Bls12381G2KeyPair);
export const get = getGet(resolve);
