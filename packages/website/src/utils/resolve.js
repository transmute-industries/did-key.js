import * as didKey from '@transmute/did-key.js';

export const resolve = async (did, representation) => {
  return didKey.resolve(did, { accept: representation });
};
