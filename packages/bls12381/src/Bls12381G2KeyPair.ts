import * as mattr from '@mattrglobal/bls12381-key-pair';

import { generateBls12381KeyPair } from '@mattrglobal/bbs-signatures';
import * as bs58 from 'bs58';

export class Bls12381G2KeyPair extends mattr.Bls12381G2KeyPair {
  static async generate(options: any) {
    const keyPair = generateBls12381KeyPair();
    return new mattr.Bls12381G2KeyPair({
      ...options,
      privateKeyBase58: bs58.encode(keyPair.secretKey as Uint8Array),
      publicKeyBase58: bs58.encode(keyPair.publicKey),
    });
  }
}
