import { Bls12381KeyPairs } from './Bls12381KeyPairs';
import { keyToDidDoc } from './functions/keyToDidDoc';

export const getGet = (resolve: any) => {
  const get = async ({ did, url }: any = {}) => {
    did = did || url;
    if (!did) {
      throw new TypeError('"did" must be a string.');
    }
    const result = await resolve(did);
    return result.didDocument;
  };
  return get;
};

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
    const didResolutionResponse = {
      '@context': 'https://w3id.org/did-resolution/v1',
      didDocument: await keyToDidDoc(publicKey, resolutionMetaData.accept),
      didDocumentMetadata: {
        'content-type': resolutionMetaData.accept,
      },
      didResolutionMetadata: {},
    };
    return didResolutionResponse;
  };

  return resolve;
};

export const resolve = getResolve();
export const get = getGet(resolve);
