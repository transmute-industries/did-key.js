import { driver as ed25519Driver } from '@transmute/did-key-ed25519';
import { driver as x25519Driver } from '@transmute/did-key-x25519';
import { driver as bls12381Driver } from '@transmute/did-key-bls12381';
import { driver as secp256k1Driver } from '@transmute/did-key-secp256k1';

const prefixToDriverMap: any = {
  z6Mk: ed25519Driver,
  z6LS: x25519Driver,
  zUC7: bls12381Driver,
  zQ3s: secp256k1Driver,
};

export const resolver = {
  resolve: async (did: string) => {
    if (did.indexOf('did:key:') !== 0) {
      throw new Error('did must be of method did:key.');
    }
    const idchar: any = did.split('did:key:').pop();
    const encodedType = idchar.substring(0, 4);
    try {
      const result = await prefixToDriverMap[encodedType].get({ did });
      return result;
    } catch (e) {
      throw new Error('Unknown DID Key type: ' + encodedType);
    }
  },
};
