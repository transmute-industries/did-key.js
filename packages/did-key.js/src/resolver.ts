export const resolver = {
  resolve: (did: string) => {
    if (did.indexOf('did:key:') !== 0) {
      throw new Error('did must be of method did:key.');
    }
    const idchar: any = did.split('did:key:').pop();
    const encodedType = idchar.substring(0, 4);
    switch (encodedType) {
      case 'z6Mk':
        return require('@transmute/did-key-ed25519').driver.get({ did });
      case 'z6LS':
        return require('@transmute/did-key-x25519').driver.get({ did });
      case 'zUC7':
        return require('@transmute/did-key-bls12381').driver.get({ did });
      case 'zQ3s':
        return require('@transmute/did-key-secp256k1').driver.get({ did });
      default:
        throw new Error('Unknown DID Key type: ' + encodedType);
    }
  },
};
