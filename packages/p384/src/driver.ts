import { P384KeyPair } from './P384KeyPair';

export const computeKeyId = async ({ key }: any) => {
  return `did:key:${key.fingerprint()}#${key.fingerprint()}`;
};

export const keyToDidDoc = (secp256k1Key: P384KeyPair) => {
  const did = `did:key:${secp256k1Key.fingerprint()}`;
  const publicKeyJwk = secp256k1Key.toJwk();
  const keyId = `#${publicKeyJwk.kid}`;
  delete publicKeyJwk.kid;
  return {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      {
        '@base': did,
      },
    ],
    id: did,
    publicKey: [
      {
        id: keyId,
        type: secp256k1Key.type,
        controller: did,
        publicKeyJwk,
      },
    ],
    authentication: [keyId],
    assertionMethod: [keyId],
    capabilityDelegation: [keyId],
    capabilityInvocation: [keyId],
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
  const publicKey = await P384KeyPair.fromFingerprint({ fingerprint });
  const didDoc = keyToDidDoc(publicKey);
  return didDoc;
};
