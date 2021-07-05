import { DidDocumentRepresentation } from './types';

import { publicKeyJwkToSecurityVocabType } from './publicKeyJwkToSecurityVocabType';
import { LdKeyPairInstance } from '@transmute/ld-key-pair';
const publicKeyJwkToLatestSecurityVocabType = (jwk: any) => {
  const type = publicKeyJwkToSecurityVocabType[`${jwk.kty} ${jwk.crv}`];
  if (!type) {
    throw new Error(
      'Could not map publicKeyJwk to latest security vocab type: ' +
        `${jwk.kty} ${jwk.crv}`
    );
  }
  return type;
};

export const getSerialized = async (
  keys: LdKeyPairInstance[],
  representation: DidDocumentRepresentation,
  privateKey = false
) => {
  const verificationMethod = await Promise.all(
    keys.map(async (key) => {
      const jsonWebKey = await key.export({
        type: 'JsonWebKey2020',
        privateKey,
      });
      if (representation === 'application/did+json') {
        return jsonWebKey;
      }
      const type = publicKeyJwkToLatestSecurityVocabType(
        jsonWebKey.publicKeyJwk
      );
      return await key.export({ type, privateKey });
    })
  );
  return verificationMethod;
};
