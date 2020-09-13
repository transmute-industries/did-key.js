/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */

import * as node12Crypto from 'crypto';

import { X25519KeyPair } from '../../X25519KeyPair';

const crypto: any = node12Crypto;

export async function deriveEphemeralKeyPair() {
  const k0 = await X25519KeyPair.generate({
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  });

  const epk = await k0.toJwk();

  return {
    keypair: await k0.toJsonWebKey(true),
    epk,
  };
}
