import { typeMap } from './startsWithMap';

const noSupportForSeed = ['secp256r1', 'secp384r1', 'secp521r1'];

const getOptionsForType = (type) => {
  if (type === 'secp256r1') {
    return {
      kty: 'EC',
      crvOrSize: 'P-256',
    };
  }

  if (type === 'secp384r1') {
    return {
      kty: 'EC',
      crvOrSize: 'P-384',
    };
  }

  if (type === 'secp521r1') {
    return {
      kty: 'EC',
      crvOrSize: 'P-521',
    };
  }
};

export const generate = (type, seed, representation) => {
  if (!typeMap[type]) {
    throw new Error('Unsupported type: ' + type);
  }

  let options = {
    secureRandom: () => {
      return Uint8Array.from(Buffer.from(seed, 'hex'));
    },
  };

  if (noSupportForSeed.includes(type)) {
    options = getOptionsForType(type);
  }

  return typeMap[type].generate(options, { accept: representation });
};
