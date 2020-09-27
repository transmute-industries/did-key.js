import { X25519KeyPair } from './X25519KeyPair';
import { getResolve } from '@transmute/did-key-common';

export const resolve = getResolve(X25519KeyPair);

export const get = async ({ did, url }: any = {}) => {
  did = did || url;
  if (!did) {
    throw new TypeError('"did" must be a string.');
  }
  const result = await resolve(did);
  return result.didDocument;
};
