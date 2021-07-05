import * as didKey from '@transmute/did-key.js';
export const generate = (type, seed, representation) => {
  return didKey.generate(
    type,
    {
      secureRandom: () => {
        return Buffer.from(seed, 'hex');
      },
    },
    { accept: representation }
  );
};
