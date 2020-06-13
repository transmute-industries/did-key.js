import { driver as secp256k1_driver } from '@transmute/did-key-secp256k1';
import { driver as ed25519_driver } from '@transmute/did-key-ed25519';
import { driver as x25519_driver } from '@transmute/did-key-x25519';
import { driver as bls12381_driver } from '@transmute/did-key-bls12381';

export const resolver = {
  resolve: (did: string) => {
    if (did.indexOf('did:key:') !== 0) {
      throw new Error('did must be of method did:key.');
    }
    const idchar: any = did.split('did:key:').pop();
    const encodedType = idchar.substring(0, 4);
    switch (encodedType) {
      case 'z6Mk':
        return ed25519_driver.get({ did });
      case 'z6LS':
        return x25519_driver.get({ did });
      case 'zUC7':
        return bls12381_driver.get({ did });
      case 'zQ3s':
        return secp256k1_driver.get({ did });
      default:
        throw new Error('Unknown DID Key type: ' + encodedType);
    }
  },
};
