import bs58 from 'bs58';

import { crvToMulticodecPrefix } from '../constants';
import { jwkToBase58 } from './jwkToBase58';

export const getMultibaseFromJwk = (publicKeyJwk: any): string => {
  const { publicKeyBase58 } = jwkToBase58(publicKeyJwk);
  const publicKeyBytes = bs58.decode(publicKeyBase58);
  const prefix = crvToMulticodecPrefix[publicKeyJwk.crv];
  const buffer = new Uint8Array(3 + publicKeyBytes.length);
  // https://github.com/multiformats/multicodec/pull/190
  buffer[0] = 0x12;
  buffer[1] = prefix;
  buffer[2] = 0x01;
  buffer.set(publicKeyBytes, 3);
  // prefix with `z` to indicate multi-base base58btc encoding
  return `z${bs58.encode(buffer)}`;
};
