import { LinkedDataKeyPair, JsonWebKeyPair } from '../types';
import { base58KeyPairToJwk } from './base58KeyPairToJwk';
import { getJwkTypeFromMultibase } from './getJwkTypeFromMultibase';
export const toJwkPair = (keypair: LinkedDataKeyPair): JsonWebKeyPair => {
  const id = keypair.id.substring(keypair.id.indexOf('#') + 1);
  let _keypair: any = {
    id: keypair.id,
    type: 'JsonWebKey2020',
    controller: keypair.controller,
  };

  _keypair.publicKeyJwk = {
    ...getJwkTypeFromMultibase(id),
    ...base58KeyPairToJwk({
      publicKeyBase58: keypair.publicKeyBase58,
    } as any),
  };

  if (keypair.privateKeyBase58) {
    _keypair.privateKeyJwk = {
      ...getJwkTypeFromMultibase(id),
      ...base58KeyPairToJwk({
        publicKeyBase58: keypair.publicKeyBase58,
        privateKeyBase58: keypair.privateKeyBase58,
      } as any),
    };
  }

  return _keypair;
};
