import bs58 from 'bs58';
import base64url from 'base64url';
import {
  MULTIBASE_ENCODED_BASE58_IDENTIFIER,
  BLS12381G1ANDG2_MULTICODEC_IDENTIFIER,
  VARIABLE_INTEGER_TRAILING_BYTE,
} from '../constants';

export const keypairsToDidKey = (
  g1JsonWebKeyPair: any,
  g2JsonWebKeyPair: any
) => {
  const g1Buffer = base64url.toBuffer(g1JsonWebKeyPair.publicKeyJwk.x);
  const g2Buffer = base64url.toBuffer(g2JsonWebKeyPair.publicKeyJwk.x);
  const g1AndG2 = Buffer.concat([g1Buffer, g2Buffer]);
  const buffer = new Uint8Array(2 + g1AndG2.length);
  buffer[0] = BLS12381G1ANDG2_MULTICODEC_IDENTIFIER;
  buffer[1] = VARIABLE_INTEGER_TRAILING_BYTE;

  buffer.set(g1AndG2, 2);
  return `did:key:${MULTIBASE_ENCODED_BASE58_IDENTIFIER}${bs58.encode(buffer)}`;
};
