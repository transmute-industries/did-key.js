import bs58 from 'bs58';

import {
  BLS12381G1ANDG2_MULTICODEC_IDENTIFIER,
  BLS12381G1_MULTICODEC_IDENTIFIER,
  BLS12381G2_MULTICODEC_IDENTIFIER,
  VARIABLE_INTEGER_TRAILING_BYTE,
} from '../constants';

import { toJsonWebKeyPair } from './toJsonWebKeyPair';
export const fingerprintToJsonWebKeyPair = (fingerprint: string) => {
  if (fingerprint[0] !== 'z') {
    throw new Error('base58 encoded fingerprint must start with "z"');
  }

  const buffer = bs58.decode(fingerprint.substring(1));

  if (
    buffer[0] === BLS12381G1_MULTICODEC_IDENTIFIER &&
    buffer[1] === VARIABLE_INTEGER_TRAILING_BYTE
  ) {
    let kp = toJsonWebKeyPair({
      type: 'Bls12381G1Key2020',
      publicKeyBase58: bs58.encode(buffer.slice(2)),
    });
    return {
      bls12381G1KeyPair: {
        ...kp,
        id: '#' + fingerprint,
        controller: `did:key:${fingerprint}`,
      },
    };
  }

  if (
    buffer[0] === BLS12381G2_MULTICODEC_IDENTIFIER &&
    buffer[1] === VARIABLE_INTEGER_TRAILING_BYTE
  ) {
    let kp = toJsonWebKeyPair({
      type: 'Bls12381G2Key2020',
      publicKeyBase58: bs58.encode(buffer.slice(2)),
    });
    return {
      bls12381G2KeyPair: {
        ...kp,
        id: '#' + fingerprint,
        controller: `did:key:${fingerprint}`,
      },
    };
  }

  if (
    buffer[0] === BLS12381G1ANDG2_MULTICODEC_IDENTIFIER &&
    buffer[1] === VARIABLE_INTEGER_TRAILING_BYTE
  ) {
    let g1 = toJsonWebKeyPair({
      type: 'Bls12381G1Key2020',
      publicKeyBase58: bs58.encode(buffer.slice(2), 50),
    });

    let g2 = toJsonWebKeyPair({
      type: 'Bls12381G2Key2020',
      publicKeyBase58: bs58.encode(buffer.slice(50)),
    });
    return {
      bls12381G1KeyPair: {
        ...g1,
        id: '#' + fingerprint,
        controller: `did:key:${fingerprint}`,
      },
      bls12381G2KeyPair: {
        ...g2,
        id: '#' + fingerprint,
        controller: `did:key:${fingerprint}`,
      },
    };
  }

  throw new Error('unsupported fingerprint is not g1, g2 or g1 and g2.');
};
