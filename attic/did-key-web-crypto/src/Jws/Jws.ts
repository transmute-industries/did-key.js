import crypto from '../crypto';
import { Jws } from '@transmute/did-key-common';

import { crvToJwsHashAlg } from '../constants';

const { createJws, verifyJws, createDetachedJws, verifyDetachedJws } = Jws;

export { createJws, verifyJws, createDetachedJws, verifyDetachedJws };

export const privateKeyToSigner = async (privateKeyJwk: any) => {
  const privateKey = await crypto.subtle.importKey(
    'jwk',
    privateKeyJwk,
    {
      name: 'ECDSA',
      namedCurve: privateKeyJwk.crv,
    },
    true,
    ['sign']
  );

  return {
    sign: async (data: Buffer) => {
      const signature = await crypto.subtle.sign(
        {
          name: 'ECDSA',
          hash: { name: crvToJwsHashAlg[privateKeyJwk.crv] },
        },
        privateKey,
        data
      );
      return signature as Buffer;
    },
  };
};

export const publicKeyToVerifier = async (publicKeyJwk: any) => {
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    publicKeyJwk,
    {
      name: 'ECDSA',
      namedCurve: publicKeyJwk.crv,
    },
    true,
    ['verify']
  );

  return {
    verify: async (toBeVerified: Buffer, signature: Buffer) => {
      const verified = await crypto.subtle.verify(
        {
          name: 'ECDSA',
          hash: { name: crvToJwsHashAlg[publicKeyJwk.crv] },
        },
        publicKey,
        signature,
        toBeVerified
      );
      return verified;
    },
  };
};
