import { driver as ed25519Driver } from '@transmute/did-key-ed25519';
import { driver as x25519Driver } from '@transmute/did-key-x25519';
import { driver as bls12381Driver } from '@transmute/did-key-bls12381';
import { driver as secp256k1Driver } from '@transmute/did-key-secp256k1';
import { driver as didWebDriver } from '@transmute/did-key-web-crypto';

const prefixToDriverMap: any = {
  z6M: ed25519Driver,
  z6L: x25519Driver,
  zUC: bls12381Driver, //g2
  z3t: bls12381Driver, //g1
  z5T: bls12381Driver, //g1andg2
  zQ3: secp256k1Driver,
  zru: didWebDriver,
  zFw: didWebDriver,
  zWG: didWebDriver,
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
    const encodedType = idchar.substring(0, 3);
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
