import { Bls12381G2KeyPair } from '@mattrglobal/bls12381-key-pair';
import bs58 from 'bs58';
export const keyToDidDoc = (bls12381Key: any) => {
  const did = `did:key:${bls12381Key.fingerprint()}`;
  const keyId = `#${bls12381Key.fingerprint()}`;
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
        type: bls12381Key.type,
        controller: did,
        publicKeyBase58: bs58.encode(bls12381Key.publicKeyBuffer),
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

  const publicKey = await Bls12381G2KeyPair.fromFingerprint({ fingerprint });
  const didDoc = keyToDidDoc(publicKey);
  return didDoc;
};
