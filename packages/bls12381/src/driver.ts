import { getGet } from '@transmute/did-key-common';

import { Bls12381KeyPairs } from './Bls12381KeyPairs';
import { keyToDidDoc } from './functions/keyToDidDoc'

export const getResolve = () => {
    const resolve = async (
      didUri: string,
      resolutionMetaData: any = { accept: 'application/did+ld+json' }
    ) => {
      const fingerprint = didUri
        .split('#')[0]
        .split('did:key:')
        .pop();
      const publicKey = await Bls12381KeyPairs.fromFingerprint({ fingerprint });
      return {
        didDocument: await keyToDidDoc(publicKey, resolutionMetaData.accept),
        didDocumentMetaData: {
          'content-type': resolutionMetaData.accept,
        },
        didResolutionMetaData: {},
      };
    };
    return resolve;
  };

export const resolve = getResolve();
export const get = getGet(resolve);
