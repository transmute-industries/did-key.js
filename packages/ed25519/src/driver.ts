import { Ed25519KeyPair } from './Ed25519KeyPair';
export const computeKeyId = async ({ key }: any) => {
  return `did:key:${key.fingerprint()}#${key.fingerprint()}`;
};

export const keyToDidDoc = (ed25519Key: Ed25519KeyPair) => {
  const did = `did:key:${ed25519Key.fingerprint()}`;
  const keyId = `#${ed25519Key.fingerprint()}`;
  const x25519: any = ed25519Key.toX25519KeyPair(false);
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
    keyAgreement: [
      {
        id: x25519.id,
        type: x25519.type,
        controller: did,
        publicKeyBase58: x25519.publicKeyBase58,
      }
    ]
  };
};

export const get = async ({ did, url }: any = {}) => {
  did = did || url;
  if (!did) {
    throw new TypeError('"did" must be a string.');
  }
  const fingerprint = did.split('#')[0].split('did:key:').pop();
  const publicKey = await Ed25519KeyPair.fromFingerprint({ fingerprint });
  const didDoc = keyToDidDoc(publicKey);
  return didDoc;
};
