import { KeyPair } from './KeyPair';

export const keyToDidDoc = (key: KeyPair) => {
  const did = `did:key:${key.fingerprint()}`;
  const keyId = `#${key.fingerprint()}`;
  return {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      {
        '@base': did,
      },
    ],
    id: did,
    publicKey: [key.toJsonWebKey()],
    authentication: [keyId],
    assertionMethod: [keyId],
    capabilityDelegation: [keyId],
    capabilityInvocation: [keyId],
    keyAgreement: [keyId],
  };
};

export const get = async ({ did, url }: any = {}) => {
  did = did || url;
  if (!did) {
    throw new TypeError('"did" must be a string.');
  }
  const fingerprint = did
    .split('#')[0]
    .split('did:key:')
    .pop();

  const publicKey = await KeyPair.fromFingerprint({ fingerprint });
  const didDoc = keyToDidDoc(publicKey);
  return didDoc;
};
