import bs58 from 'bs58';

import { crv_to_multicodec } from '../constants';
import { jwkToBase58 } from './jwkToBase58';

export const publicKeyToFingerprint = (publicKeyJwk: any): string => {
  const publicKeyBase58 = jwkToBase58(publicKeyJwk);
  const publicKeyBytes = bs58.decode(publicKeyBase58);
  const prefix: Uint8Array = crv_to_multicodec[publicKeyJwk.crv];
  const buffer = new Uint8Array(3 + publicKeyBytes.length);
  buffer[0] = prefix[0];
  buffer[1] = prefix[1];
  buffer[2] = 0x01;
  buffer.set(publicKeyBytes, 3);
  // prefix with `z` to indicate multi-base base58btc encoding
  return `z${bs58.encode(buffer)}`;
};
