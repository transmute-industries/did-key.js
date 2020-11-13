import { driver as ed25519Driver } from '@transmute/did-key-ed25519';
import { driver as x25519Driver } from '@transmute/did-key-x25519';
import { driver as bls12381Driver } from '@transmute/did-key-bls12381';
import { driver as secp256k1Driver } from '@transmute/did-key-secp256k1';
import { driver as didWebDriver } from '@transmute/did-key-web-crypto';

const prefixToDriverMap: any = {
  z6Mk: ed25519Driver,
  z6LS: x25519Driver,
  zUC7: bls12381Driver, //g2
  z3tE: bls12381Driver, //g1
  z7nC: bls12381Driver, //g1andg2
  zQ3s: secp256k1Driver,
  zXwp: didWebDriver,
  zACH: didWebDriver,
  zJss: didWebDriver,
};

export const resolver = {
  resolve: async (
    didUrl: string,
    resolutionMetaData: any = { accept: 'application/did+ld+json' }
  ) => {
    if (didUrl.indexOf('did:key:') !== 0) {
      throw new Error('did must be of method did:key.');
    }
    const idchar: any = didUrl.split('did:key:').pop();
    const encodedType = idchar.substring(0, 4);
    try {
      const result = await prefixToDriverMap[encodedType].resolve(
        didUrl,
        resolutionMetaData
      );
      return result;
    } catch (e) {
      console.error(e);
      throw new Error('Unknown DID Key type: ' + encodedType);
    }
  },
};
