import * as didKey from '@transmute/did-key.js';

export const convert = async (keys, representation) => {
  return didKey.convert(keys, { accept: representation });
};
