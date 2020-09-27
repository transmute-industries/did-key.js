import { getResolve, getGet } from '@transmute/did-key-common';

import { KeyPair } from './KeyPair';

export const resolve = getResolve(KeyPair);
export const get = getGet(resolve);
