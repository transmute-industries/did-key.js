import { X25519KeyPair } from './X25519KeyPair';

export const keyToDidDoc = (x25519Key: any) => {
  const did = `did:key:${x25519Key.fingerprint()}`;
  const keyId = `#${x25519Key.fingerprint()}`;
  return {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      {
        '@base': did,
      },
    ],
    id: did,
    keyAgreement: [
      {
        id: keyId,
        type: x25519Key.type,
        controller: did,
        publicKeyBase58: x25519Key.publicKeyBase58,
      },
    ],
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
  const publicKey = await X25519KeyPair.fromFingerprint({ fingerprint });
  const didDoc = keyToDidDoc(publicKey);
  return didDoc;
};
