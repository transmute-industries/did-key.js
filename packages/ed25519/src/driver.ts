import { getResolve, getGet } from '@transmute/did-key-common';

import { Ed25519KeyPair } from './Ed25519KeyPair';

export const resolve = getResolve(Ed25519KeyPair);
export const get = getGet(resolve);
