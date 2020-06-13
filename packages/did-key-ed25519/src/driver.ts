import { Ed25519KeyPair } from './Ed25519KeyPair';
export const computeKeyId = async ({ key }: any) => {
  return `did:key:${key.fingerprint()}#${key.fingerprint()}`;
};

export const keyToDidDoc = (ed25519Key: any) => {
  const did = `did:key:${ed25519Key.fingerprint()}`;
  const keyId = `#${ed25519Key.fingerprint()}`;

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
        type: ed25519Key.type,
        controller: did,
        publicKeyBase58: ed25519Key.publicKeyBase58,
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
  const fingerprint = did.split('#').pop();
  const publicKey = await Ed25519KeyPair.fromFingerprint({ fingerprint });
  const didDoc = keyToDidDoc(publicKey);
  return didDoc;
};
