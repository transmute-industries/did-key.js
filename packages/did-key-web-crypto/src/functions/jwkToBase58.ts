import bs58 from 'bs58';
import base64url from 'base64url';

import { types } from '@transmute/did-key-cipher';

export const jwkToBase58 = (jwk: any): types.LinkedDataKeyPair => {
  let keypair: any = {};
  if (jwk.d) {
    keypair.privateKeyBase58 = bs58.encode(
      Buffer.concat([base64url.toBuffer(jwk.d)])
    );
  }
  if (jwk.x) {
    keypair.publicKeyBase58 = bs58.encode(
      Buffer.concat([base64url.toBuffer(jwk.x)])
    );
  }
  if (jwk.x && jwk.y) {
    keypair.publicKeyBase58 = bs58.encode(
      Buffer.concat([base64url.toBuffer(jwk.x), base64url.toBuffer(jwk.y)])
    );
  }

  return keypair;
};
